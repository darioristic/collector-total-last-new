"use client"

import { BellIcon, ClockIcon } from "lucide-react"
import Link from "next/link"
import { useIsMobile } from "@/hooks/use-mobile"
import { useNotifications } from "@/hooks/use-notifications"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface NotificationBellProps {
  userId: string
}

export function NotificationBell({ userId }: NotificationBellProps) {
  const isMobile = useIsMobile()
  const { notifications, unreadCount, isLoading, markAsRead } = useNotifications({ userId })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return 'Yesterday'
    return date.toLocaleDateString()
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✅'
      case 'warning':
        return '⚠️'
      case 'error':
        return '❌'
      case 'confirm':
        return '❓'
      default:
        return 'ℹ️'
    }
  }

  const handleNotificationClick = async (notification: { id: string; read_at: string | null }) => {
    if (!notification.read_at) {
      await markAsRead(notification.id)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          size="icon" 
          variant="ghost" 
          className="relative focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:border-0 focus-visible:ring-0 hover:border-0 active:border-0"
        >
          <BellIcon className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align={isMobile ? "center" : "end"} className="w-80 p-0">
        <DropdownMenuLabel className="bg-background dark:bg-muted sticky top-0 z-10 p-0">
          <div className="flex justify-between border-b px-6 py-4">
            <div className="font-medium">Notifications</div>
            <Button variant="link" className="h-auto p-0 text-xs" size="sm" asChild>
              <Link href="/dashboard/settings/notifications">View all</Link>
            </Button>
          </div>
        </DropdownMenuLabel>

        {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
        <ScrollArea className="h-[350px]">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={`skeleton-${Math.random()}-${i}`} className="flex items-start gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <BellIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No notifications yet</p>
            </div>
          ) : (
            notifications.slice(0, 10).map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="group flex cursor-pointer items-start gap-3 rounded-none border-b px-4 py-3"
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex flex-1 items-start gap-3">
                  <div className="flex-none">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                      <span className="text-sm">
                        {getNotificationIcon(notification.type)}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium">
                        {notification.title}
                      </span>
                      {!notification.read_at && (
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <div className="text-muted-foreground line-clamp-2 text-xs">
                      {notification.message}
                    </div>
                    {notification.type === "confirm" && notification.metadata?.actions && (
                      <div className="flex items-center gap-2 mt-2">
                        {notification.metadata.actions.map((action: { type: string; label: string }, index: number) => (
                          <Button 
                            key={`${notification.id}-action-${index}`}
                            size="sm" 
                            variant={action.type === 'accept' ? 'default' : 'outline'}
                            className="h-6 text-xs"
                          >
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <ClockIcon className="h-3 w-3" />
                      {formatDate(notification.created_at)}
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
