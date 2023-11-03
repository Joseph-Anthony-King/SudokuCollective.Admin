<template>
  <v-card>
    <v-card-title class="justify-center text-center">
      <span class="headline"></span>
    </v-card-title>
    <v-card-text v-if="isSuccess && confirmationType === EmailConfirmationType.NEWPROFILECONFIRMED || confirmationType === EmailConfirmationType.NEWEMAILCONFIRMED">
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
          <a :href="mailTo" target="_blank">{{ email }}</a>.  Please do not respond to the email as the email is not monitored, simply following the link 
          contained in the email.
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
    <v-card-actions>
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

const close = (event: Event | undefined = undefined): void => {
  event?.preventDefault();
  emit("close-email-confirmed-widget", undefined, undefined);
};
</script>
