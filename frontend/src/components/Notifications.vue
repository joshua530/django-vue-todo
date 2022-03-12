<template>
  <div class="notifications">
    <div
      v-for="notification in notifier.notifications"
      :key="notification.id"
      :class="[
        notification.type ? notification.type : 'success',
        'notification'
      ]"
    >
      <p>{{ notification.message }}</p>
    </div>
  </div>
</template>

<script>
import useNotifications from '../store/notifications';

export default {
  name: 'Notifications',
  setup() {
    const notifier = useNotifications();
    return {
      notifier
    };
  }
};
</script>
