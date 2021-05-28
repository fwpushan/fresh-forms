<template>
  <div>
    <NavBar title="Freshworks Forms Hack" :clientType="ClientIdType.User">
      <template #end>
        <Button
          v-if="isAuthenticated"
          label="Home"
          icon="pi pi-fw pi-home"
          class="p-button-text"
          style="color: white"
          @click="
            $router.push({
              name: UserRoutesConst.APP_DASHBOARD,
            })
          "
        />
      </template>
    </NavBar>
  </div>
</template>

<script lang="ts">
import { UserRoutesConst } from "../../../../constants/routes/RouteConstants";
import { ClientIdType } from "../../../../types/contracts/ConfigContract";
import NavBar from "./NavBar.vue";

export default {
  components: {
    NavBar,
  },
  props: {
    isAuthenticated: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    return {
      UserRoutesConst,
      ClientIdType,
    };
  },
};
</script>
