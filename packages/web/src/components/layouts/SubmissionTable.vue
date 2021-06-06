<template>
  <div>
    <div>
      <router-view v-if="loadChildren" />
    </div>
    <div v-if="!loadChildren">
      <h3>Submitted Forms</h3>
      <v-sheet elevation="1" class="mx-auto">
        <v-container>
          <DataTable autoLayout="true" :value="submissions">
            <Column field="userName" header="Name"></Column>
            <Column field="createdAt" header="Crated at"></Column>
            <Column field="updateAt" header="Update at"></Column>
            <Column field="formName" header="Form"></Column>
            <Column>
              <template #body="slotProps">
                <Button @click="onViewEdit(slotProps.data)">View/Edit</Button>
              </template>
            </Column>
          </DataTable>
        </v-container>
      </v-sheet>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import ApiClient from "../../services/http/ApiClient";
import { FormSubmissionContract } from "../../types";
import { UserRoutesConst } from "../../constants/routes/RouteConstants";
export default {
  components: { DataTable, Column },
  setup() {
    // State variables
    const submissions = ref([] as FormSubmissionContract[]);
    const loadChildren = ref(false);
    // Hooks
    const router = useRouter();

    // Mount hook
    onMounted(async () => {
      const remoteData = await ApiClient.DynamicForms.submissions();
      submissions.value = remoteData;
    });

    // UI events
    const onViewEdit = (data: FormSubmissionContract) => {
      console.log(`On VIEW/EDIT: ${JSON.stringify(data, null, 2)}`);
      router.push({
        name: UserRoutesConst.FORM_CONTAINER,
        params: {
          formName: data.formName,
          id: data.id,
        },
      });
    };
    return {
      submissions,
      loadChildren,
      onViewEdit,
    };
  },
};
</script>

<style></style>
