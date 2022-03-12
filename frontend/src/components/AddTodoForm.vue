<template>
  <div v-if="formVisible" class="modal">
    <form id="modal-form" v-on:submit="addTodoItem">
      <div class="form-region">
        <label for="task-name">Name</label>
        <input
          ref="textBox"
          class="todo-text"
          type="text"
          v-model="text"
          id="task-name"
        />
        <button type="submit" class="add-task-btn waves-effect waves-light">
          <span class="fa fa-plus"></span>
        </button>
        <span
          v-on:click="toggleVisibility()"
          class="fa fa-times close-todo-form"
        ></span>
      </div>
    </form>
  </div>
</template>

<script>
import useNotifications from '../store/notifications';
import useAuthentication from '../store/authentication';
import useTodoStore from '../store/todos';

export default {
  setup() {
    const notifier = useNotifications();
    const auth = useAuthentication();
    const todoStore = useTodoStore();
    return {
      notifier,
      auth,
      todoStore
    };
  },
  name: 'AddTodoForm',
  data() {
    return {
      text: ''
    };
  },
  data() {
    return {
      formVisible: false
    };
  },
  methods: {
    /** used so that parent can toggle form visibility */
    toggleVisibility() {
      this.formVisible = !this.formVisible;
      if (this.formVisible) {
        // wait for component to mount
        setTimeout(() => {
          this.$refs.textBox.focus();
        }, 200);
      }
    },

    async postTodoItem(name) {
      const accessToken = this.auth.getAccessToken();
      const endpoint = `${process.env.VUE_APP_SERVER}/api/v1/todo/`;
      return fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify({ name }),
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        }
      }).then((response) => {
        if (response.status !== 200) return Promise.reject(response.status);
        return response.json();
      });
    },

    async addTodoItem(e) {
      e.preventDefault();
      const todoName = this.text.trim();
      if (!todoName) this.notifier.danger('Todo name cannot be empty');
      if (this.auth.accessTokenExpired()) {
        await this.auth.performServerSideValidation();
      }
      this.postTodoItem(todoName)
        .then(
          (data) => {
            const todo = { ...data };
            this.todoStore.addTodo(todo);
            this.text = '';
          },
          (status) => {
            // maybe access token expired, refresh it
            if (status === 401) {
              this.auth.performServerSideValidation().then(() => {
                this.postTodoItem(todoName).then(
                  (data) => {
                    const todo = { ...data };
                    this.todoStore.addTodo(todo);
                    this.text = '';
                  },
                  (error) => {
                    this.notifier.danger('Todo item addition failed');
                  }
                );
              });
            }
          }
        )
        .catch((err) => console.log(err));
    }
  }
};
</script>
