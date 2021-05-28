<template>
  <v-app>
    <CommonLayout v-if="isAuthReady" :isAuthenticated="isAuthenticated" />
  </v-app>
</template>

<script lang="ts">
import { useRouter } from "vue-router";
import { ref, onMounted, computed } from "vue";
import { AppConfigService } from "../../services/AppConfigService";
import { UserRoutesConst } from "../../constants/routes/RouteConstants";
import { ClientIdType } from "../../types/contracts/ConfigContract";
import CommonLayout from "../../components/layouts/User/CommonLayout.vue";

export default {
  components: {
    CommonLayout,
  },
  setup() {
    const router = useRouter();
    // const route = useRoute();
    const isAuthReady = ref(false);
    const clientType = ref(ClientIdType.User);
    const isAuthenticated = computed(
      () => AppConfigService.shared.authService?.authenticated === true,
    );
    // Mounding hook
    onMounted(async () => {
      await AppConfigService.shared.initAuthService(ClientIdType.User);
      isAuthReady.value = true;
      const auth = AppConfigService.shared.authService?.authenticated ?? false;
      if (!auth) {
        router.push({
          name: UserRoutesConst.LOGIN,
        });
      }
    });

    return {
      isAuthReady,
      isAuthenticated,
      UserRoutesConst,
      clientType,
    };
  },
};
</script>
