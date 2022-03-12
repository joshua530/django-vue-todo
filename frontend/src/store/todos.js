import { defineStore } from 'pinia';
import useAuthentication from './authentication';
import useNotification from './notifications';

export default defineStore('todoItems', {
  state: () => ({
    todoItems: [],
    /** indicates whether at least one request has been made to the server to fetch todos */
    todosFetchedFromServer: false
  }),
  getters: {
    todos() {
      return this.todoItems;
    }
  },
  actions: {
    setTodos(todos) {
      this.todos = todos;
    },
    async getTodosPromise() {
      let auth = useAuthentication();
      const endpoint = `${process.env.VUE_APP_SERVER}/api/v1/todos/`;
      if (!auth.userAuthenticated) await auth.performServerSideValidation();
      const token = auth.getAccessToken();
      return fetch(endpoint, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then((response) => {
        if (response.status !== 200) return Promise.reject(response.status);
        return response.json();
      });
    },
    fetchTodos() {
      // let auth = useAuthentication();
      if (!this.todosFetchedFromServer) {
        this.getTodosPromise()
          .then(
            (data) => (this.todoItems = data),
            (status) => {
              // auth token invalid or expired
              if (status === 401) {
                const auth = useAuthentication();
                auth.performServerSideValidation().then(
                  this.getTodosPromise().then(
                    (data) => {
                      this.todoItems = data;
                    },
                    (error) => {
                      // access token isn't the problem
                    }
                  )
                );
              }
              const notifier = useNotification();
              notifier.danger(
                'Error occured while fetching data. logout and try again'
              );
            }
          )
          .catch((err) => console.log(err));
      }
    },
    addTodo(todo) {
      this.todoItems.push(todo);
    },
    deleteTodo(id) {
      let index = this.todoItems.findIndex((todo) => todo.id === id);
      if (index !== -1) this.todoItems.splice(index, 1);
    },
    updateTodo(id, doneStatus) {
      this.todoItems = this.todoItems.map((todo) => {
        if (todo.id === id) todo.done = doneStatus;
        return todo;
      });
    }
  }
});
