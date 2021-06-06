<template>
  <div>
    <ProgressSpinner v-if="!hideSpinner" />
    <div ref="formioContainerRef"></div>
  </div>
</template>

<script lang="ts">
import { onMounted, ref } from "vue";
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
  },
  setup(props: any, context: SetupContext) {
    const formioContainerRef = ref(null);
    const hideSpinner = ref(false);

    onMounted(async () => {
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
      if (props.data) {
        form.submission = {
          data: props.data,
        };
      } else {
        if (props.id && props.id !== "none") {
          const subMissionData = await ApiClient.DynamicForms.submission(
            props.id,
          );
          form.submission = {
            data: subMissionData.data,
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
    });

    return { formioContainerRef, hideSpinner };
  },
};
</script>

<style lang="scss"></style>
