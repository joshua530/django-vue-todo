<template>
  <div :class="['todo-item', done ? 'todo-item-done' : 'todo-item-undone']">
    <p>{{ name }}</p>
    <p class="markers">
      <i
        title="mark as undone"
        v-if="done"
        class="fa fa-check cursor-pointer"
        v-on:click="updateTodo()"
      ></i>
      <i
        title="mark as done"
        v-if="!done"
        class="fa fa-clock cursor-pointer"
        v-on:click="updateTodo()"
      ></i>
      <i
        title="delete item"
        class="fa fa-times delete-task"
        v-on:click="deleteTodo()"
      ></i>
    </p>
  </div>
</template>

<script>
import useTodoStore from '../store/todos';
import useAuthentication from '../store/authentication';
import useNotifications from '../store/notifications';

export default {
  setup() {
    return {
      todoStore: useTodoStore(),
      auth: useAuthentication(),
      notifier: useNotifications()
    };
  },
  name: 'Todo',
  props: {
    name: {
      type: String,
      required: true
    },
    done: {
      type: Boolean,
      required: true
    },
    id: {
      type: Number,
      required: true
    }
  },
  methods: {
    performServerRequest(type) {
      let lowerType = type.toLowerCase();
      const method = lowerType === 'update' ? 'PUT' : 'DELETE';
      const endpoint = `${process.env.VUE_APP_SERVER}/api/v1/todo/${this.id}/`;
      const accessToken = this.auth.getAccessToken();
      fetch(endpoint, {
        method,
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        }
      })
        .then((response) => {
          if (response.status !== 200)
            return Promise.reject({
              message: 'Error occured while updating todo item'
            });
          return response.json();
        })
        .then(
          (data) => {
            if (lowerType === 'update')
              this.todoStore.updateTodo(data.id, data.done);
            else this.todoStore.deleteTodo(this.id);
          },
          (error) => {
            this.notifier.danger(error.message);
          }
        );
    },

    updateTodo() {
      if (this.auth.accessTokenExpired()) {
        this.auth.performServerSideValidation().then(() => {
          this.performServerRequest('update');
        });
      } else {
        this.performServerRequest('update');
      }
    },

    deleteTodo() {
      if (this.auth.accessTokenExpired()) {
        this.auth.performServerSideValidation().then(() => {
          this.performServerRequest('delete');
        });
      } else {
        this.performServerRequest('delete');
      }
    }
  }
};
</script>
