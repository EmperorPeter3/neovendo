import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from './useNotifications';

export const useMessageNotifications = () => {
  const { user } = useAuth();
  const { sendNotification, isEnabled } = useNotifications();
  const subscribedRef = useRef(false);

  useEffect(() => {
    if (!user || !isEnabled || subscribedRef.current) return;

    subscribedRef.current = true;

    const channel = supabase
      .channel('global-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        async (payload) => {
          const newMessage = payload.new as {
            id: string;
            chat_id: string;
            sender_id: string;
            content: string;
            created_at: string;
          };

          // Don't notify for own messages
          if (newMessage.sender_id === user.id) return;

          // Check if this message is in a chat the user is part of
          const { data: chat } = await supabase
            .from('chats')
            .select('id, buyer_id, seller_id')
            .eq('id', newMessage.chat_id)
            .single();

          if (!chat) return;
          if (chat.buyer_id !== user.id && chat.seller_id !== user.id) return;

          // Get sender name
          const { data: sender } = await supabase
            .from('profiles')
            .select('name')
            .eq('user_id', newMessage.sender_id)
            .single();

          const senderName = sender?.name || 'Someone';
          const messagePreview = newMessage.content.length > 50 
            ? newMessage.content.substring(0, 50) + '...' 
            : newMessage.content;

          sendNotification(`New message from ${senderName}`, {
            body: messagePreview,
            tag: `message-${newMessage.chat_id}`,
          });
        }
      )
      .subscribe();

    return () => {
      subscribedRef.current = false;
      supabase.removeChannel(channel);
    };
  }, [user, isEnabled, sendNotification]);
};
