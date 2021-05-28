<template>
  <Card class="p-m-4">
    <template #title> User Login </template>
    <template #content>
      <div>
        <h1>Welcome to Forms Freshworks</h1>
        <h4>
          We are using KeyCloak for Authentication. Please click on Login
          buttons below to start your sign in/sign up with your Key Cloak Id.
        </h4>
      </div>
    </template>

    <template #footer>
      <Button
        label="Login with KeyCloak"
        icon="pi pi-check"
        class="p-mr-2"
        @click="login"
      ></Button>
    </template>
  </Card>
</template>

<script lang="ts">
import { ref } from "vue";
import { AppConfigService } from "../../services/AppConfigService";

export default {
  components: {},
  props: {
    showBasicBCeIDMessage: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  setup(props: any) {
    const login = () => {
      AppConfigService.shared.authService?.login();
    };

    return { login };
  },
};
</script>
