<template>
  <div class="login-form">
    <h5 class="text-underline">Log in to continue</h5>
    <form v-on:submit="logIn">
      <div class="form-section">
        <label for="username">Username</label>
        <input v-model="username" type="text" name="username" id="username" />
      </div>
      <div class="form-section">
        <label for="password">Password</label>
        <input
          v-model="password"
          type="password"
          name="password"
          id="password"
        />
      </div>
      <button class="btn-white">Submit</button>
    </form>
  </div>
</template>

<script>
import useNotifications from '../store/notifications';
import useAuthentication from '../store/authentication';

export default {
  setup() {
    return {
      notifier: useNotifications(),
      auth: useAuthentication()
    };
  },
  name: 'LoginForm',
  data() {
    return {
      username: '',
      password: ''
    };
  },
  methods: {
    logIn(e) {
      e.preventDefault();
      const username = this.username.trim();
      const password = this.password.trim();

      if (!username) {
        this.notifier.danger('username cannot be empty');
        return;
      }
      if (!password) {
        this.notifier.danger('password cannot be empty');
        return;
      }

      const endPoint = `${process.env.VUE_APP_SERVER}/api/v1/users/login/`;
      fetch(endPoint, {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: {
          'Content-type': 'application/json'
        }
      })
        .then((response) => {
          if (response.status !== 200) {
            if (response.status === 500)
              return Promise.reject({
                message: 'Server error occured, refresh page and try again'
              });
            else
              return Promise.reject({
                message: 'Invalid login details provided'
              });
          }
          return response.json();
        })
        .then(
          (authTokens) => {
            const refresh = authTokens['refresh'];
            const access = authTokens['access'];
            this.auth.setRefreshToken(refresh);
            this.auth.setAccessToken(access);
            this.auth.setAccessTokenExpired(false);
            this.$router.push('/');
          },
          (errorPromise) => {
            this.notifier.danger(errorPromise['message']);
          }
        )
        .catch((error) => console.log(error));
    }
  }
};
</script>
