<template>
  <v-container>
    <div class="left-dashboard">
      <UserSubmissionTable />
    </div>
  </v-container>
</template>

<script lang="ts">
import UserSubmissionTable from "../../components/layouts/SubmissionTable.vue";
export default {
  components: { UserSubmissionTable },
};
</script>

<style lang="scss">
.left-dashboard {
  margin-left: 75px;
}
</style>
