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
  items?: MenuModel[];
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
        label: "Duck Feed App",
        icon: "pi pi-twitter",
        items: [
          {
            label: "Duck feed table",
            icon: "pi pi-table",
          },
          {
            label: "Add new feed",
            icon: "pi pi-pencil",
            command: () => {
              router.push({
                name: UserRoutesConst.FORM_CONTAINER,
                params: {
                  formName: "duckfeedform",
                  dataURL: "lake-location",
                  id: "none",
                },
              });
            },
          },
          {
            label: "Add new lake",
            icon: "pi pi-map-marker",
            command: () => {
              router.push({
                name: UserRoutesConst.FORM_CONTAINER,
                params: {
                  formName: "lakeform",
                  dataURL: "",
                  id: "none",
                },
              });
            },
          },
        ],
      },
    ]);

    return {
      items,
    };
  },
};
</script>
