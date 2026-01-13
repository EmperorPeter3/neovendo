import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useChatMessages, useSendMessage, useMarkMessagesAsRead, useChats } from '@/hooks/useChats';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Send, Smile } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const EMOJI_LIST = ['😊', '👍', '❤️', '😂', '🙏', '🎉', '👏', '🔥'];

const ChatPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { data: chats } = useChats();
  const { data: messages, isLoading } = useChatMessages(id || '');
  const sendMessage = useSendMessage();
  const markAsRead = useMarkMessagesAsRead();
  
  const [newMessage, setNewMessage] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chat = chats?.find(c => c.id === id);
  const otherUser = chat ? (chat.buyer_id === user?.id ? chat.seller : chat.buyer) : null;

  useEffect(() => {
    if (id && messages?.length) {
      markAsRead.mutate(id);
    }
  }, [id, messages?.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !id) return;

    try {
      await sendMessage.mutateAsync({
        chatId: id,
        content: newMessage.trim(),
      });
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const addEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojis(false);
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <Layout>
      <div className="container py-0 max-w-2xl h-[calc(100vh-4rem)]">
        <div className="flex flex-col h-full">
          {/* Chat Header */}
          <div className="flex items-center gap-3 py-4 border-b border-border">
            <Link to="/messages" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            
            <Avatar className="h-10 w-10">
              <AvatarImage src={otherUser?.avatar_url || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {getInitials(otherUser?.name)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h2 className="font-medium text-foreground">{otherUser?.name || 'Loading...'}</h2>
              {chat?.listing && (
                <Link to={`/listing/${chat.listing.id}`} className="text-sm text-primary hover:underline">
                  {chat.listing.title}
                </Link>
              )}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              messages?.map(message => {
                const isOwn = message.sender_id === user.id;
                return (
                  <div 
                    key={message.id} 
                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[75%] ${isOwn ? 'order-2' : 'order-1'}`}>
                      <div className={`flex items-end gap-2 ${isOwn ? 'flex-row-reverse' : ''}`}>
                        {!isOwn && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={message.sender?.avatar_url || undefined} />
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {getInitials(message.sender?.name)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        
                        <div 
                          className={`rounded-2xl px-4 py-2 ${
                            isOwn 
                              ? 'bg-primary text-primary-foreground rounded-br-md' 
                              : 'bg-muted text-foreground rounded-bl-md'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                      </div>
                      
                      <p className={`text-xs text-muted-foreground mt-1 ${isOwn ? 'text-right' : 'text-left ml-10'}`}>
                        {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="py-4 border-t border-border">
            <div className="relative">
              {showEmojis && (
                <div className="absolute bottom-full left-0 mb-2 bg-card border border-border rounded-lg p-2 shadow-lg flex gap-1">
                  {EMOJI_LIST.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => addEmoji(emoji)}
                      className="p-1 hover:bg-muted rounded text-xl"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowEmojis(!showEmojis)}
                >
                  <Smile className="w-5 h-5" />
                </Button>
                
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                
                <Button
                  onClick={handleSend}
                  disabled={!newMessage.trim() || sendMessage.isPending}
                  className="gradient-hero text-primary-foreground"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ChatPage;
