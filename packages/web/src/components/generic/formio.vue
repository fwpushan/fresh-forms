<template>
  <div>
    <ProgressSpinner v-if="!hideSpinner" />
    <div ref="formioContainerRef"></div>
  </div>
</template>

<script lang="ts">
import { onUpdated, onMounted, ref } from "vue";
import { Formio } from "formiojs";
import { SetupContext } from "vue";
import ApiClient from "../../services/http/ApiClient";

export default {
  emits: ["submitted", "loaded", "changed"],
  props: {
    formName: {
      type: String,
      required: true,
    },
    data: {
      type: Object,
    },
    id: {
      type: String,
    },
    additionalDataURL: {
      type: String,
    },
  },
  setup(props: any, context: SetupContext) {
    const formioContainerRef = ref(null);
    const hideSpinner = ref(false);

    const loadForm = async () => {
      // Use SIMS API as a proxy to retrieve the form definition from formio.
      const formDefinition = await ApiClient.DynamicForms.getFormDefinition(
        props.formName,
      );

      const form = await Formio.createForm(
        formioContainerRef.value,
        formDefinition.data,
      );

      form.nosubmit = true;
      hideSpinner.value = true;
      let additionalData = {};
      if (props.additionalDataURL || form.submission?.data?.additionalDataURL) {
        const dataURL =
          props.additionalDataURL || form.submission?.data?.additionalDataURL;
        additionalData = (
          await ApiClient.DynamicForms.getFormAdditionalData(dataURL)
        ).data;

        console.dir({
          url: props.additionalDataURL,
          data: additionalData,
        });
      }
      if (props.data) {
        form.submission = {
          data: { ...props.data, ...additionalData },
        };
      } else {
        if (props.id && props.id !== "none") {
          const subMissionData = await ApiClient.DynamicForms.submission(
            props.id,
          );
          form.submission = {
            data: { ...subMissionData.data, ...additionalData },
          };
        } else {
          form.submission = {
            data: additionalData,
          };
        }
      }

      context.emit("loaded", form);

      // Triggered when any component in the form is changed.
      form.on("change", (event: any) => {
        context.emit("changed", form, event);
      });

      form.on("submit", (submision: any) => {
        context.emit("submitted", submision.data, form);
      });
    };
    onUpdated(loadForm);
    onMounted(loadForm);

    return { formioContainerRef, hideSpinner };
  },
};
</script>

<style lang="scss"></style>
