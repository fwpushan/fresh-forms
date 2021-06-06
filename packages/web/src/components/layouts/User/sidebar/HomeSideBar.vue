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
        label: "Forms",
        icon: "pi pi-file",
        command: () => {
          router.push({
            name: UserRoutesConst.FORM_LIST,
          });
        },
      },
      {
        label: "Submission",
        icon: "pi pi-clone",
        command: () => {
          router.push({
            name: UserRoutesConst.FORM_SUBMISSION,
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
