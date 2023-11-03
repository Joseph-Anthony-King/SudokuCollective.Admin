<template>
  <v-card class="justify-center text-center">
    <v-card-title>
      <span class="headline">{{ title }}</span>
    </v-card-title>
    <v-card-text v-if="isSuccess && confirmationType !== EmailConfirmationType.OLDEMAILCONFIRMED">
      <v-container>
        <p>
          Thank you for confirming your email address {{ userName }}, your profile has been updated.  Hope you are having fun!
        </p>
      </v-container>
    </v-card-text>
    <v-card-text v-else-if="isSuccess && confirmationType === EmailConfirmationType.OLDEMAILCONFIRMED">
      <v-container>
        <p>
          Thank you for confirming your old email address {{ userName }}, please review and confirm your new email address by following the link sent to 
          <a :href="mailTo" target="_blank">{{ email }}</a>.
          <br /><br />
          Please do not respond to the email as the email is not monitored, simply follow the link contained in the email.
          <br /><br />
          If you do not complete this process within 24 hours of its initiation your email will revert to its original value.
        </p>
      </v-container>
    </v-card-text>
    <v-card-text v-else-if="!isSuccess">
      <v-container>
        <p>
          There was an error confirming your email address {{ userName }} and your request could not be completed.
        </p>
      </v-container>
    </v-card-text>
    <v-card-actions class="text-center">
      <v-row :dense="true">
        <v-col cols="12">
          <v-btn color="blue darken-1" text @click="close($event)">
            ok
          </v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ComputedRef, Ref, computed, ref } from 'vue';
import { useConfirmEmailStore } from "@/store/confirmEmailStore";
import { EmailConfirmationType } from '@/enums/emailConfirmationType';

const emit = defineEmits(["close-email-confirmed-widget"]);

const confirmEmailStore = useConfirmEmailStore();

const isSuccess: Ref<boolean | null> = ref(confirmEmailStore.getIsSuccess);
const confirmationType: Ref<EmailConfirmationType | null> = ref(confirmEmailStore.getConfirmationType);
const userName: Ref<string | null> = ref(confirmEmailStore.getUserName);
const email: Ref<string | null> = ref(confirmEmailStore.getEmail);

const mailTo: ComputedRef<string> = computed(() => `mailto:${email.value}`);

const title: ComputedRef<string> = computed(() => {
  if (confirmationType.value === EmailConfirmationType.NEWPROFILECONFIRMED) {
    return "Email Confirmed";
  } else if (confirmationType.value === EmailConfirmationType.OLDEMAILCONFIRMED) {
    return "Old Email Confirmed";
  } else if (confirmationType.value === EmailConfirmationType.NEWEMAILCONFIRMED) {
    return "New Email Confirmed";
  } else {
    return "Email Not Confirmed"
  }
});

const close = (event: Event | undefined = undefined): void => {
  event?.preventDefault();
  emit("close-email-confirmed-widget", undefined, undefined);
};
</script>
