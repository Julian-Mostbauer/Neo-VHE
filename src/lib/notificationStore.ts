import { writable, type Writable } from "svelte/store";

interface Notification {
  id: number;
  text: string;
  lifetime: number;
  initialLifetime: number;
}

export const notifications: Writable<Notification[]> = writable([]);

export function addNotification(
  text: string = "default message",
  lifetime: number = 5000
) {
  const id = Date.now();
  notifications.update((n) => [...n, { id, text, lifetime, initialLifetime: lifetime }]);

  const interval = setInterval(() => {
    notifications.update((n) => {
      return n
        .map((notification) => {
          if (notification.id === id) {
            notification.lifetime -= 100;
          }
          return notification;
        })
        .filter((notification) => notification.lifetime > 0);
    });
  }, 100);

  setTimeout(() => {
    clearInterval(interval);
    notifications.update((n) =>
      n.filter((notification) => notification.id !== id)
    );
  }, lifetime);
}
