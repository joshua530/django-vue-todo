<template>
  <footer>
    <p>Todo app &copy; {{ year }}</p>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
  data() {
    return {
      year: new Date().getFullYear()
    };
  }
};
</script>
