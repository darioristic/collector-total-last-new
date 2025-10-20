// Collector Bot - šalje notifikacije sa profile photo
export interface CollectorNotification {
  id: string;
  title: string;
  role: string;
  desc: string;
  avatar: string;
  status: string;
  unread_message: boolean;
  type: "text" | "confirm";
  date: string;
}

export class CollectorBot {
  private static instance: CollectorBot;
  private notifications: CollectorNotification[] = [];
  private subscribers: ((notifications: CollectorNotification[]) => void)[] = [];

  private constructor() {
    this.startBot();
  }

  public static getInstance(): CollectorBot {
    if (!CollectorBot.instance) {
      CollectorBot.instance = new CollectorBot();
    }
    return CollectorBot.instance;
  }

  // Pretplati se na notifikacije
  public subscribe(callback: (notifications: CollectorNotification[]) => void) {
    this.subscribers.push(callback);
    // Pošalji trenutne notifikacije
    callback(this.notifications);
  }

  // Odjavi se od notifikacija
  public unsubscribe(callback: (notifications: CollectorNotification[]) => void) {
    this.subscribers = this.subscribers.filter(sub => sub !== callback);
  }

  // Dodaj novu notifikaciju
  public addNotification(notification: Omit<CollectorNotification, 'id' | 'date'>) {
    const newNotification: CollectorNotification = {
      ...notification,
      id: this.generateId(),
      date: new Date().toLocaleDateString()
    };

    this.notifications.unshift(newNotification); // Dodaj na vrh
    this.notifications = this.notifications.slice(0, 10); // Zadrži samo poslednjih 10

    // Obavesti sve pretplatnike
    this.notifySubscribers();
  }

  // Označi notifikaciju kao pročitanu
  public markAsRead(notificationId: string) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.unread_message = false;
      this.notifySubscribers();
    }
  }

  // Dohvati sve notifikacije
  public getNotifications(): CollectorNotification[] {
    return [...this.notifications];
  }

  // Dohvati broj nepročitanih notifikacija
  public getUnreadCount(): number {
    return this.notifications.filter(n => n.unread_message).length;
  }

  // Generiši ID
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Obavesti sve pretplatnike
  private notifySubscribers() {
    this.subscribers.forEach(callback => callback([...this.notifications]));
  }

  // Pokreni bot
  private startBot() {
    // Dodaj početne notifikacije
    this.addInitialNotifications();

    // Bot ne šalje automatski notifikacije - čeka da se eksplicitno pozove
    console.log('Collector Bot started - waiting for system notifications');
  }

  // Dodaj početne notifikacije
  private addInitialNotifications() {
    const initialNotifications = [
      {
        title: "Your order is placed",
        role: "System",
        desc: "Amet minim mollit non deser unt ullamco e...",
        avatar: "1.png",
        status: "online",
        unread_message: false,
        type: "text" as const
      },
      {
        title: "Congratulations Darlene 🎉",
        role: "System",
        desc: "Won the monthly best seller badge",
        avatar: "2.png",
        status: "online",
        unread_message: true,
        type: "text" as const
      },
      {
        title: "Joaquina Weisenborn",
        role: "User",
        desc: "Requesting access permission",
        avatar: "3.png",
        status: "online",
        unread_message: true,
        type: "confirm" as const
      },
      {
        title: "Brooklyn Simmons",
        role: "User",
        desc: "Added you to Top Secret Project...",
        avatar: "4.png",
        status: "online",
        unread_message: true,
        type: "text" as const
      }
    ];

    initialNotifications.forEach(notif => {
      this.addNotification(notif);
    });
  }

  // Pošalji sistemsku notifikaciju
  public sendSystemNotification(title: string, desc: string, type: "text" | "confirm" = "text") {
    this.addNotification({
      title,
      role: "System",
      desc,
      avatar: "1.png", // Sistem koristi avatar 1
      status: "online",
      unread_message: true,
      type
    });
  }

  // Pošalji korisničku notifikaciju
  public sendUserNotification(title: string, desc: string, avatar: string = "2.png", type: "text" | "confirm" = "text") {
    this.addNotification({
      title,
      role: "User",
      desc,
      avatar,
      status: "online",
      unread_message: true,
      type
    });
  }
}

// Export singleton instance
export const collectorBot = CollectorBot.getInstance();
