<template>
  <router-link :to="path" class="btn-action">{{ name }}</router-link>
</template>

<script>
export default {
  name: 'HeaderLink',
  props: {
    name: String,
    path: String
  }
};
</script>
