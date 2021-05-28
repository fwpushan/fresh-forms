<template>
  <div>
    <v-app-bar app>
      <Header :isAuthenticated="isAuthenticated" />
    </v-app-bar>
    <router-view></router-view>
  </div>
</template>
<script lang="ts">
import Header from "../User/common/Header.vue";
export default {
  name: "CommonLayout",
  components: {
    Header,
  },
  props: {
    isAuthenticated: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<style>
</style>