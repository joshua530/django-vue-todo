<template>
  <div class="container">
    <TodoContainer />
    <div class="container my-5">
      <button
        title="toggle add task form"
        v-on:click="toggleTodo"
        class="btn-white"
      >
        Add Task
      </button>
    </div>
    <div class="container my-5">
      <!-- TODO get quote from api -->
      <h5 class="text-underline">Today's quote</h5>
      <p>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Atque
        recusandae minima libero! Totam tenetur vel nesciunt odio provident
        reiciendis, cupiditate nemo fugit incidunt repudiandae consequuntur
        sequi dolore inventore laboriosam amet!
      </p>
    </div>
    <AddTodoForm ref="addTodoForm" />
  </div>
</template>

<script>
import AddTodoForm from '../components/AddTodoForm';
import TodoContainer from '../components/TodoContainer';

export default {
  name: 'Home',
  components: { AddTodoForm, TodoContainer },
  methods: {
    toggleTodo() {
      this.$refs.addTodoForm.toggleVisibility();
    }
  }
};
</script>
