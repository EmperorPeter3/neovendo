import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

export interface ChatWithDetails {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  created_at: string;
  updated_at: string;
  listing: {
    id: string;
    title: string;
    images: string[];
    price: number;
  } | null;
  buyer: {
    id: string;
    name: string;
    avatar_url: string | null;
  } | null;
  seller: {
    id: string;
    name: string;
    avatar_url: string | null;
  } | null;
  last_message?: {
    content: string;
    created_at: string;
    is_read: boolean;
    sender_id: string;
  } | null;
}

export interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  attachments: string[];
  is_read: boolean;
  created_at: string;
  sender?: {
    name: string;
    avatar_url: string | null;
  } | null;
}

export const useChats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['chats', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Get chats
      const { data: chats, error } = await supabase
        .from('chats')
        .select('*')
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      // Get unique user IDs and listing IDs
      const userIds = [...new Set(chats?.flatMap(c => [c.buyer_id, c.seller_id]) || [])];
      const listingIds = [...new Set(chats?.map(c => c.listing_id) || [])];

      // Fetch profiles
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, name, avatar_url, user_id')
        .in('user_id', userIds);

      const profilesMap = new Map(profiles?.map(p => [p.user_id, p]) || []);

      // Fetch listings
      const { data: listings } = await supabase
        .from('listings')
        .select('id, title, images, price')
        .in('id', listingIds);

      const listingsMap = new Map(listings?.map(l => [l.id, l]) || []);

      // Fetch last message for each chat
      const chatsWithDetails = await Promise.all(
        (chats || []).map(async (chat) => {
          const { data: messages } = await supabase
            .from('messages')
            .select('content, created_at, is_read, sender_id')
            .eq('chat_id', chat.id)
            .order('created_at', { ascending: false })
            .limit(1);

          return {
            ...chat,
            listing: listingsMap.get(chat.listing_id) || null,
            buyer: profilesMap.get(chat.buyer_id) || null,
            seller: profilesMap.get(chat.seller_id) || null,
            last_message: messages?.[0] || null,
          };
        })
      );

      return chatsWithDetails as ChatWithDetails[];
    },
    enabled: !!user,
  });
};

export const useChatMessages = (chatId: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['messages', chatId],
    queryFn: async () => {
      const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Fetch senders
      const senderIds = [...new Set(messages?.map(m => m.sender_id) || [])];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('name, avatar_url, user_id')
        .in('user_id', senderIds);

      const profilesMap = new Map(profiles?.map(p => [p.user_id, p]) || []);

      return (messages || []).map(msg => ({
        ...msg,
        sender: profilesMap.get(msg.sender_id) || null,
      })) as Message[];
    },
    enabled: !!chatId,
  });

  // Subscribe to realtime updates
  useEffect(() => {
    if (!chatId) return;

    const channel = supabase
      .channel(`messages:${chatId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chatId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId, queryClient]);

  return query;
};

export const useCreateChat = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      listingId,
      sellerId,
    }: {
      listingId: string;
      sellerId: string;
    }) => {
      if (!user) throw new Error('Not authenticated');

      // Check if chat already exists
      const { data: existingChat } = await supabase
        .from('chats')
        .select('id')
        .eq('listing_id', listingId)
        .eq('buyer_id', user.id)
        .maybeSingle();

      if (existingChat) {
        return existingChat;
      }

      const { data, error } = await supabase
        .from('chats')
        .insert({
          listing_id: listingId,
          buyer_id: user.id,
          seller_id: sellerId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      chatId,
      content,
      attachments = [],
    }: {
      chatId: string;
      content: string;
      attachments?: string[];
    }) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('messages')
        .insert({
          chat_id: chatId,
          sender_id: user.id,
          content,
          attachments,
        })
        .select()
        .single();

      if (error) throw error;

      // Update chat updated_at
      await supabase
        .from('chats')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', chatId);

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.chatId] });
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
  });
};

export const useMarkMessagesAsRead = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (chatId: string) => {
      if (!user) return;

      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('chat_id', chatId)
        .neq('sender_id', user.id)
        .eq('is_read', false);

      if (error) throw error;
    },
    onSuccess: (_, chatId) => {
      queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
  });
};
