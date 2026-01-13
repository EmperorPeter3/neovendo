import { Button } from '@/components/ui/button';
import { Bell, BellOff, Check } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { useToast } from '@/hooks/use-toast';

export const NotificationBanner = () => {
  const { isSupported, permission, requestPermission } = useNotifications();
  const { toast } = useToast();

  if (!isSupported || permission !== 'default') {
    return null;
  }

  const handleEnable = async () => {
    const granted = await requestPermission();
    if (granted) {
      toast({
        title: 'Notifications enabled',
        description: "You'll be notified of new messages",
      });
    }
  };

  return (
    <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mb-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <Bell className="w-5 h-5 text-primary" />
        <p className="text-sm text-foreground">
          Enable notifications to get alerted about new messages
        </p>
      </div>
      <Button size="sm" onClick={handleEnable} className="shrink-0">
        Enable
      </Button>
    </div>
  );
};

export const NotificationToggle = () => {
  const { isSupported, permission, requestPermission } = useNotifications();
  const { toast } = useToast();

  if (!isSupported) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <BellOff className="w-4 h-4" />
        <span>Notifications not supported</span>
      </div>
    );
  }

  if (permission === 'granted') {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
        <Check className="w-4 h-4" />
        <span>Notifications enabled</span>
      </div>
    );
  }

  if (permission === 'denied') {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <BellOff className="w-4 h-4" />
        <span>Notifications blocked</span>
      </div>
    );
  }

  const handleEnable = async () => {
    const granted = await requestPermission();
    toast({
      title: granted ? 'Notifications enabled' : 'Permission denied',
      description: granted 
        ? "You'll be notified of new messages" 
        : 'You can enable notifications in browser settings',
      variant: granted ? 'default' : 'destructive',
    });
  };

  return (
    <Button variant="outline" size="sm" onClick={handleEnable} className="gap-2">
      <Bell className="w-4 h-4" />
      Enable notifications
    </Button>
  );
};
