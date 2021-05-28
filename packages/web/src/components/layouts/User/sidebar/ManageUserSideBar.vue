<template>
  <Menu :model="items" />
</template>
<script lang="ts">
import Menu from "primevue/menu";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { UserRoutesConst } from "../../../../constants/routes/RouteConstants";

interface MenuModel {
  label: string;
  icon: string;
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
        label: "Institution Details",
        icon: "pi pi-info-circle",
        command: () => {
          router.push({
            name: UserRoutesConst.APP_USER,
          });
        },
      },
    ]);

    return {
      items,
    };
  },
};
</script>
