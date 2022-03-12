<template>
  <div class="login-form">
    <h5 class="text-underline">Sign up</h5>
    <form v-on:submit="createUser">
      <div class="form-section">
        <label for="username">Username</label>
        <input type="text" v-model="username" name="username" id="username" />
      </div>
      <div class="form-section">
        <label for="email">Email</label>
        <input type="email" v-model="email" name="email" id="email" />
      </div>
      <div class="form-section">
        <label for="password">Password</label>
        <input
          type="password"
          v-model="password"
          name="password"
          id="password"
        />
      </div>
      <div class="form-section">
        <label for="password-confirmation">Confirm Password</label>
        <input
          v-model="passwordConfirmation"
          type="password"
          name="password-confirmation"
          id="password-confirmation"
        />
      </div>
      <button class="btn-white">Submit</button>
    </form>
  </div>
</template>

<script>
import useNotifications from '../store/notifications';

export default {
  name: 'SignUpForm',
  setup() {
    return {
      notifier: useNotifications()
    };
  },
  data() {
    return {
      username: '',
      email: '',
      password: '',
      passwordConfirmation: ''
    };
  },
  methods: {
    createUser(e) {
      e.preventDefault();
      const username = this.username.trim();
      const email = this.email.trim();
      const password = this.password.trim();
      const passwordConfirmation = this.passwordConfirmation.trim();

      if (!username) {
        this.notifier.danger('username cannot be empty');
        return;
      }
      if (username.length < 3) {
        this.notifier.danger('username must be at least 3 characters long');
        return;
      }

      if (!email) {
        this.notifier.danger('email cannot be empty');
        return;
      }
      if (!password) {
        this.notifier.danger('password cannot be empty');
        return;
      }
      if (password.length < 5) {
        this.notifier.danger('password length cannot be less than five');
        return;
      }
      if (password !== passwordConfirmation) {
        this.notifier.danger(
          'confirmation password does not match the password'
        );
        return;
      }

      const user = { username, email, password };
      const endPoint = `${process.env.VUE_APP_SERVER}/api/v1/users/sign-up/`;
      fetch(endPoint, {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
          'Content-type': 'application/json'
        }
      })
        .then((response) => {
          if (response.status !== 201 && response.status !== 200)
            return Promise.reject(response.json());
          return response.json();
        })
        .then(
          // user creation successful
          (data) => {
            this.notifier.success(
              'Account creation successful, login to proceed'
            );
            this.$router.push('/login');
          },
          // user creation failed
          (errorPromise) => {
            errorPromise.then((data) => {
              for (let k in data) {
                let messages = data[k];
                if (typeof messages !== 'string')
                  for (let msg of messages) this.notifier.danger(msg);
                else this.notifier.danger(messages);
              }
            });
          }
        )
        .catch((error) => console.log(error));
    }
  }
};
</script>
