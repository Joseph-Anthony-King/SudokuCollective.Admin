<template>
  <v-container>
    <v-card-title class="justify-center text-center">
      <span class="headline">Create New App</span>
    </v-card-title>
    <v-form
      v-model="formValid"
      ref="form"
      @submit.prevent="submitHandler">
      <v-row>
        <v-col
          cols="12"
          lg="6"
          xl="6">
          <v-text-field
            v-model="appName"
            label="App Name"
            prepend-icon="mdi-rename-box"
            :rules="requiredRules('App Name')"
            color="primary"
            required />
          <v-text-field
            v-model="localUrl"
            label="Local URL"
            prepend-icon="mdi-lan"
            color="primary"
            :rules="urlRules" />
          <v-text-field
            v-model="testUrl"
            label="Test URL"
            prepend-icon="mdi-flask"
            color="primary"
            :rules="urlRules" />
          <v-text-field
            v-model="stagingUrl"
            label="Staging URL"
            prepend-icon="mdi-server"
            color="primary"
            :rules="urlRules" />
          <v-text-field
            v-model="prodUrl"
            label="Production URL"
            prepend-icon="mdi-earth"
            color="primary"
            :rules="urlRules" />
          <v-text-field
            v-model="sourceCodeUrl"
            label="Source Code URL"
            prepend-icon="mdi-github"
            color="primary"
            :rules="urlRules" />
        </v-col>
      </v-row>
      <AvailableActions>
        <v-row dense>
          <v-col
            cols="12"
            sm="6"
            md="6">
            <v-tooltip
              open-delay="2000"
              location="bottom">
              <template v-slot:activator="{ props }">
                <v-btn
                  color="primary"
                  :disabled="!formValid"
                  @click="submitHandler"
                  v-bind="props"
                  >Create</v-btn
                >
              </template>
              <span>Create a new app</span>
            </v-tooltip>
          </v-col>
          <v-col
            cols="12"
            sm="6"
            md="6">
            <v-tooltip
              open-delay="2000"
              location="bottom">
              <template v-slot:activator="{ props }">
                <v-btn
                  text
                  @click="cancelHandler"
                  v-bind="props"
                  >Cancel</v-btn
                >
              </template>
              <span>Cancel app creation</span>
            </v-tooltip>
          </v-col>
        </v-row>
      </AvailableActions>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { storeToRefs } from 'pinia';
  import AvailableActions from '@/components/buttons/AvailableActions.vue';
  import rules from '@/utilities/rules/index';
  import { useUserStore } from '@/stores/userStore';

  const emit = defineEmits(['created', 'cancel']);

  const appName = ref('');
  const localUrl = ref('');
  const testUrl = ref('');
  const stagingUrl = ref('');
  const prodUrl = ref('');
  const sourceCodeUrl = ref('');
  const formValid = ref(false);
  const form = ref();
  const { requiredRules, urlRules } = rules();

  const userStore = useUserStore();
  const { getUser } = storeToRefs(userStore);

  const submitHandler = () => {
    if (!formValid.value) return;
    emit('created', {
      name: appName.value,
      ownerId: getUser.value.id,
      localUrl: localUrl.value,
      testUrl: testUrl.value,
      stagingUrl: stagingUrl.value,
      prodUrl: prodUrl.value,
      sourceCodeUrl: sourceCodeUrl.value,
    });
    appName.value = '';
    localUrl.value = '';
    testUrl.value = '';
    stagingUrl.value = '';
    prodUrl.value = '';
    sourceCodeUrl.value = '';
  };

  const cancelHandler = () => {
    emit('cancel');
    appName.value = '';
    localUrl.value = '';
    testUrl.value = '';
    stagingUrl.value = '';
    prodUrl.value = '';
    sourceCodeUrl.value = '';
  };
</script>
