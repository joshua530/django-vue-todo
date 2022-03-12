import { defineStore } from 'pinia';
import useNotifications from './notifications';
import router from '../router/router';

export default defineStore('authentication', {
  state: () => ({
    userAuthenticated: false
  }),
  actions: {
    /** ensures revalidation is done after the given number of minutes */
    runValidationRequestTimer(timeInMinutes = 4) {
      setTimeout(() => {
        this.setAccessTokenExpired(true);
        this.userAuthenticated = false;
      }, 1000 * 60 * timeInMinutes);
    },

    isAuthenticated() {
      const accessTokenExpired = this.accessTokenExpired();
      const accessToken = this.getAccessToken();
      const accessTokenIsEmpty =
        accessToken === null || accessToken.trim() === '';
      this.userAuthenticated = !accessTokenIsEmpty && !accessTokenExpired;
      return this.userAuthenticated;
    },

    /**
     * performs server side validation
     *
     * It performs server side validation then returns promise containing boolean of
     * whether server side validation succeeded or failed
     */
    performServerSideValidation() {
      const refreshToken = this.getRefreshToken();
      if (refreshToken) {
        const endpoint = `${process.env.VUE_APP_SERVER}/api/v1/users/token/refresh/`;
        return fetch(endpoint, {
          method: 'POST',
          body: JSON.stringify({ refresh: refreshToken }),
          headers: {
            'Content-type': 'application/json'
          }
        })
          .then((response) => {
            if (response.status !== 200) return Promise.reject(response.json());
            return response.json();
          })
          .then(
            (data) => {
              this.setAccessToken(data['access']);
              this.setAccessTokenExpired(false);
              this.userAuthenticated = true;
              this.runValidationRequestTimer();
              return true;
            },
            (errordata) => {
              // refresh token is invalid or expired, user should log in again
              const notifier = useNotifications();
              // notifier.info('Session has expired, login to continue');
              this.deleteAuthCredentials();
              this.userAuthenticated = false;
              router.push('/login');
              return false;
            }
          );
      }
      // refresh token is absent, need to log in to get a new one
      return new Promise((resolve, reject) => resolve(false));
    },

    getRefreshToken() {
      return localStorage.getItem('refreshToken');
    },

    setRefreshToken(token) {
      localStorage.setItem('refreshToken', token);
    },

    getAccessToken() {
      return localStorage.getItem('accessToken');
    },

    setAccessToken(token) {
      localStorage.setItem('accessToken', token);
    },

    deleteAccessToken() {
      localStorage.removeItem('accessToken');
      this.accessTokenExpired(true);
    },

    deleteRefreshToken() {
      localStorage.removeItem('refreshToken');
    },

    accessTokenExpired() {
      let accessTokenExpired = localStorage.getItem('accessTokenExpired');
      if (accessTokenExpired === null || accessTokenExpired === 'true') {
        // value not set yet
        accessTokenExpired = true;
        localStorage.setItem('accessTokenExpired', true);
      } else if (accessTokenExpired === 'false') {
        accessTokenExpired = false;
      }
      return accessTokenExpired;
    },

    setAccessTokenExpired(value = true) {
      localStorage.setItem('accessTokenExpired', value);
    },

    logout() {
      const endpoint = `${process.env.VUE_APP_SERVER}/api/v1/users/logout/`;
      const refreshToken = this.getRefreshToken();
      const accessToken = this.getAccessToken();
      const notifier = useNotifications();
      return fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify({ refresh: refreshToken }),
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-type': 'application/json'
        }
      })
        .then((response) => {
          if (response.status !== 200)
            return Promise.reject({ code: response.status });
          return response.json();
        })
        .then(
          (data) => {
            this.deleteAuthCredentials();
            this.setAccessTokenExpired(true);
            this.userAuthenticated = false;
            router.push('/login');
          },
          (badData) => {
            const code = badData['code'];
            if (code >= 400 && code < 500)
              notifier.danger(
                'Error occured while logging out, wait a few seconds, refresh page and try again'
              );
            else notifier.danger('Error occured, refresh page and try again');
          }
        );
    },

    deleteAuthCredentials() {
      this.deleteAccessToken();
      this.deleteRefreshToken();
      this.userAuthenticated = false;
    }
  }
});
