import { defineStore } from 'pinia';

/**
 * Store for notifications meant to be displayed
 *
 * The format of a notification is { message: <notification-message>, type: <notification-type>, id }
 * notification-type can either be success, danger, info or warning
 */
export default defineStore('notifications', {
  state: () => ({
    notifications: [],
    notificationIndex: 1
  }),
  actions: {
    /** send message with option to specify the type of message */
    notify(message, type) {
      // add notification to notification queue
      const id = this.notificationIndex;
      this.notifications.push({ message, type, id });
      ++this.notificationIndex;
      // remove notification after 5 seconds
      setTimeout(() => {
        const indexToRemove = this.notifications.findIndex(
          (current) => current.id === id
        );
        if (indexToRemove !== -1) this.notifications.splice(indexToRemove, 1);
      }, 5000);
    },
    /** send success message */
    success(message) {
      this.notify(message, 'success');
    },
    /** send danger message */
    danger(message) {
      this.notify(message, 'danger');
    },
    /** send info message */
    info(message) {
      this.notify(message, 'info');
    },
    /** send warning message */
    warning(message) {
      this.notify(message, 'warning');
    }
  }
});
