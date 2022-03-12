<template>
  <div class="nav">
    <div class="branding">
      <router-link to="/">Todo</router-link>
    </div>
    <div class="nav-actions">
      <HeaderLink
        v-if="isAuthenticated"
        name="Logout"
        v-on:click="logout()"
        path="#"
      />
      <template v-else>
        <HeaderLink name="Login" path="/login" />
        <HeaderLink name="Sign up" path="/sign-up" />
      </template>
    </div>
  </div>
</template>

<script>
import useAuthentication from '../store/authentication';
import HeaderLink from '../components/HeaderLink';

export default {
  name: 'Header',
  setup() {
    const auth = useAuthentication();
    return { auth };
  },
  components: { HeaderLink },
  methods: {
    logout() {
      this.auth.logout();
    }
  },
  computed: {
    isAuthenticated() {
      return this.auth.userAuthenticated;
    }
  },
  data() {
    return {
      headerLinks: 'UnauthBtns'
    };
  }
};
</script>
