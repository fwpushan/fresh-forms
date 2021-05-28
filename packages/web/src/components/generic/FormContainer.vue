<template>
  <v-container>
    <Card class="p-m-4">
      <template #title> {{ title }} </template>
      <template #content>
        <formio
          :formName="formName"
          @submitted="submitted"
          @loaded="onLoaded"
        ></formio>
      </template>
    </Card>
  </v-container>
</template>

<script lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";
import { useToast } from "primevue/usetoast";
import formio from "../../components/generic/formio.vue";
import ApiClient from "../../services/http/ApiClient";
export default {
  components: { formio },
  setup() {
    const route = useRoute();
    const toast = useToast();
    const query = route.params;
    const formName = query.formName || "unknown";
    const title = ref(`Form ${formName} is loading ....`);

    const onLoaded = () => {
      title.value = `${formName}`;
    };
    const submitted = async (args: any, form: any) => {
      // Call api
      try {
        await ApiClient.DynamicForms.submitForm(formName as string, {
          data: args,
        });
        toast.add({
          severity: "success",
          summary: `Successfully submitted!`,
          detail: " Successfully!",
          life: 5000,
        });
        args.submit = false;
        form.submission = {
          data: args,
        };
      } catch (error) {
        toast.add({
          severity: "error",
          summary: "Submission error",
          detail: `An error happened during submission process. ${error}`,
          life: 5000,
        });
        args.submit = false;
        form.submission = {
          data: args,
        };
      }
    };
    return {
      title,
      formName,
      submitted,
      onLoaded,
    };
  },
};
</script>

<style></style>
