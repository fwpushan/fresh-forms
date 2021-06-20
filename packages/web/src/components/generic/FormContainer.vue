<template>
  <v-container>
    <Card class="p-m-4">
      <template #title>
        <h5>{{ title }}</h5>
        <Message severity="info" v-if="id !== 'none'">
          Edit the submission ({{ id }})
        </Message>
      </template>
      <template #content>
        <formio
          :formName="formName"
          @submitted="submitted"
          @loaded="onLoaded"
          :data="data"
          :id="id"
          :additionalDataURL="dataURL"
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
  props: {
    data: {
      type: Object,
    },
  },
  setup() {
    const route = useRoute();
    const toast = useToast();
    const query = route.params;
    const formName = query.formName || "unknown";
    const id = ref(query.id || "none");
    const title = ref(`Form ${formName} is loading ....`);
    const dataURL = ref((query.dataURL as string) || "");

    const onLoaded = () => {
      title.value = `${formName}`;
    };
    const submitted = async (args: any, form: any) => {
      // Call api
      try {
        if (id.value !== "none") {
          await ApiClient.DynamicForms.updateSubmission(
            id.value as string,
            formName as string,
            {
              data: args,
            },
          );
        } else {
          const resp = await ApiClient.DynamicForms.submitForm(
            formName as string,
            {
              data: args,
            },
          );
          id.value = resp.data;
        }
        toast.add({
          severity: "success",
          summary:
            id.value !== "none"
              ? `Successfully submitted!`
              : `Update successfully`,
          detail: "Saved Successfully!",
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
      id,
      dataURL,
    };
  },
};
</script>

<style></style>
