import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useChats } from '@/hooks/useChats';
import { useMessageNotifications } from '@/hooks/useMessageNotifications';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, ArrowLeft } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { NotificationBanner } from '@/components/NotificationBanner';

const Messages = () => {
  const { t } = useLanguage();
  const { user, isLoading: authLoading } = useAuth();
  const { data: chats, isLoading } = useChats();
  
  // Enable message notifications
  useMessageNotifications();

  if (!authLoading && !user) {
    return (
      <Layout>
        <div className="container py-12 md:py-20">
          <div className="max-w-md mx-auto text-center">
            <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="font-display text-2xl font-bold text-foreground mb-4">
              {t('login')} required
            </h1>
            <p className="text-muted-foreground mb-6">
              Please log in to view your messages
            </p>
            <Link to="/login">
              <Button className="gradient-hero text-primary-foreground">
                {t('login')}
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const getOtherUser = (chat: any) => {
    return chat.buyer_id === user?.id ? chat.seller : chat.buyer;
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Layout>
      <div className="container py-6 md:py-8 max-w-2xl">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          {t('back')}
        </Link>

        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">
          {t('messages')}
        </h1>

        <NotificationBanner />

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-card rounded-xl p-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-muted" />
                  <div className="flex-1">
                    <div className="h-4 bg-muted rounded w-1/3 mb-2" />
                    <div className="h-3 bg-muted rounded w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : !chats?.length ? (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="font-display text-xl font-semibold text-foreground mb-2">
              No messages yet
            </h2>
            <p className="text-muted-foreground mb-6">
              Start a conversation by contacting a seller
            </p>
            <Link to="/search">
              <Button className="gradient-hero text-primary-foreground">
                Browse listings
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {chats.map(chat => {
              const otherUser = getOtherUser(chat);
              const isUnread = chat.last_message && 
                !chat.last_message.is_read && 
                chat.last_message.sender_id !== user?.id;

              return (
                <Link 
                  key={chat.id} 
                  to={`/chat/${chat.id}`}
                  className="block"
                >
                  <div className={`bg-card rounded-xl p-4 hover:shadow-card transition-shadow ${isUnread ? 'border-l-4 border-primary' : ''}`}>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={otherUser?.avatar_url || undefined} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {getInitials(otherUser?.name)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`font-medium ${isUnread ? 'text-foreground' : 'text-foreground'}`}>
                            {otherUser?.name || 'Unknown'}
                          </span>
                          {chat.last_message && (
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(chat.last_message.created_at), { addSuffix: true })}
                            </span>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground truncate">
                          {chat.listing?.title}
                        </p>
                        
                        {chat.last_message && (
                          <p className={`text-sm truncate ${isUnread ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                            {chat.last_message.content}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Messages;
