<template>
  <Header />
  <div class="container">
    <router-view></router-view>
  </div>
  <Footer />
  <Notifications />
</template>

<script>
import Header from './components/Header';
import Footer from './components/Footer';
import Notifications from './components/Notifications';
import useNotifications from './store/notifications';

export default {
  name: 'App',
  setup() {
    const notifier = useNotifications();
    return { notifier };
  },
  methods: {
    doSomething(e) {
      this.notifier.notify('Did something successful', 'success');
    }
  },
  components: { Header, Footer, Notifications }
};
</script>
