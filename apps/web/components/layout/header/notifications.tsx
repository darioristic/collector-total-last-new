import { BellIcon, ClockIcon } from "lucide-react";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

// import { notifications as staticNotifications, type Notification } from "./data";
import { collectorBot, type CollectorNotification } from "@/lib/collector-bot";

const Notifications = () => {
  const isMobile = useIsMobile();
  const [notifications, setNotifications] = useState<CollectorNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Pretplati se na collector bot notifikacije
    const handleNotifications = (newNotifications: CollectorNotification[]) => {
      setNotifications(newNotifications);
      setUnreadCount(newNotifications.filter(n => n.unread_message).length);
    };

    collectorBot.subscribe(handleNotifications);

    // Cleanup
    return () => {
      collectorBot.unsubscribe(handleNotifications);
    };
  }, []);

  const handleNotificationClick = (notification: CollectorNotification) => {
    // Označi kao pročitanu
    if (notification.unread_message) {
      collectorBot.markAsRead(notification.id);
    }
    
    // Prikaži toast sa porukom
    toast(notification.title, {
      description: notification.desc,
      duration: 5000,
      action: notification.type === "confirm" ? {
        label: "Accept",
        onClick: () => toast.success("Accepted!"),
      } : undefined,
      cancel: notification.type === "confirm" ? {
        label: "Decline",
        onClick: () => toast.error("Declined!"),
      } : undefined,
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            size="icon" 
            variant="ghost" 
            className="relative focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:border-0 focus-visible:ring-0 hover:border-0 active:border-0"
          >
            <>
              <BellIcon className="animate-tada" />
              {unreadCount > 0 && (
                <span className="bg-destructive absolute end-0 top-0 block size-2 shrink-0 rounded-full"></span>
              )}
            </>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align={isMobile ? "center" : "end"} className="ms-4 w-80 p-0">
          <DropdownMenuLabel className="bg-background dark:bg-muted sticky top-0 z-10 p-0">
            <div className="flex justify-between border-b px-6 py-4">
              <div className="font-medium">Notifications</div>
              <Button variant="link" className="h-auto p-0 text-xs" size="sm" asChild>
                <Link href="#">View all</Link>
              </Button>
            </div>
          </DropdownMenuLabel>

          <ScrollArea className="h-[350px]">
            {notifications.map((item: CollectorNotification) => (
              <DropdownMenuItem
                key={item.id}
                className="group flex cursor-pointer items-start gap-9 rounded-none border-b px-4 py-3"
                onClick={() => handleNotificationClick(item)}
              >
                <div className="flex flex-1 items-start gap-2">
                  <div className="flex-none">
                    <Avatar className="size-8">
                      <AvatarImage src={`/images/avatars/${item.avatar}`} />
                      <AvatarFallback> {item.title.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="dark:group-hover:text-default-800 truncate text-sm font-medium">
                      {item.title}
                    </div>
                    <div className="dark:group-hover:text-default-700 text-muted-foreground line-clamp-1 text-xs">
                      {item.desc}
                    </div>
                    {item.type === "confirm" && (
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          Accept
                        </Button>
                        <Button size="sm" variant="destructive">
                          Decline
                        </Button>
                      </div>
                    )}
                    <div className="dark:group-hover:text-default-500 text-muted-foreground flex items-center gap-1 text-xs">
                      <ClockIcon className="size-3!" />
                      {item.date}
                    </div>
                  </div>
                </div>
                {item.unread_message && (
                  <div className="flex-0">
                    <span className="bg-destructive/80 block size-2 rounded-full border" />
                  </div>
                )}
              </DropdownMenuItem>
            ))}
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default Notifications;

