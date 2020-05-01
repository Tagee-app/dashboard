<template>
  <div>
    <Login />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Login from "@/views/Login.vue";

export default Vue.extend({
  name: 'App',

  components: {
    Login
  },

  data: () => ({
    //
  }),
});
</script>
