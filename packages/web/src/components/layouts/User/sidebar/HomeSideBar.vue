<template>
  <Menu :model="items" />
</template>
<script lang="ts">
import { useRouter } from "vue-router";
import Menu from "primevue/menu";
import { ref } from "vue";
import { UserRoutesConst } from "../../../../constants/routes/RouteConstants";

interface MenuModel {
  label: string;
  icon?: string;
  command?: () => void;
}

export default {
  components: {
    Menu,
  },
  setup() {
    const router = useRouter();
    const items = ref<MenuModel[]>([
      {
        label: "Dashboard",
        icon: "pi pi-home",
        command: () => {
          router.push({
            name: UserRoutesConst.APP_DASHBOARD,
          });
        },
      },
      {
        label: "Forms",
        icon: "pi pi-file",
        command: () => {
          router.push({
            name: "formsList",
          });
        },
      },
      {
        label: "Notifications",
        icon: "pi pi-bell",
      },
    ]);

    return {
      items,
    };
  },
};
</script>
