<template>
  <div class="container my-5">
    <Todo
      v-for="todo of todos"
      :key="todo.id"
      :name="todo.name"
      :done="todo.done"
      :id="todo.id"
    />
  </div>
</template>

<script>
import useTodoStore from '../store/todos';
import Todo from './Todo';

export default {
  setup() {
    const todoStore = useTodoStore();
    todoStore.fetchTodos();
    return {
      todoStore
    };
  },
  name: 'TodoContainer',
  components: { Todo },
  created() {
    this.todoStore.$subscribe((mutation, state) => {
      this.todos = state.todoItems;
    });
  },
  data() {
    return {
      todos: []
    };
  }
};
</script>
