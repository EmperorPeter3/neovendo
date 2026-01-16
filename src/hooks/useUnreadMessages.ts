import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useUnreadMessages = () => {
  const { user } = useAuth();
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    if (!user) {
      setHasUnread(false);
      return;
    }

    const checkUnreadMessages = async () => {
      // Get all chats where user is participant
      const { data: chats } = await supabase
        .from('chats')
        .select('id')
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`);

      if (!chats || chats.length === 0) {
        setHasUnread(false);
        return;
      }

      const chatIds = chats.map(c => c.id);

      // Check for unread messages not sent by current user
      const { data: unreadMessages } = await supabase
        .from('messages')
        .select('id')
        .in('chat_id', chatIds)
        .eq('is_read', false)
        .neq('sender_id', user.id)
        .limit(1);

      setHasUnread(!!unreadMessages && unreadMessages.length > 0);
    };

    checkUnreadMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel('unread-messages-indicator')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        async (payload) => {
          const newMessage = payload.new as { sender_id: string; chat_id: string };
          
          // If message is from someone else, check if it's in user's chat
          if (newMessage.sender_id !== user.id) {
            const { data: chat } = await supabase
              .from('chats')
              .select('id')
              .eq('id', newMessage.chat_id)
              .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
              .single();

            if (chat) {
              setHasUnread(true);
            }
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
        },
        () => {
          // Recheck when messages are updated (marked as read)
          checkUnreadMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { hasUnread };
};
