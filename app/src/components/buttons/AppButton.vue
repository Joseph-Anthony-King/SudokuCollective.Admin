<template>
  <v-card
    :color="evaluateColor(index)"
    class="app-button"
    @click="type === 'Your Apps' ? selectApp() : navigateToApp()">
    <v-card-title>
      <span class="select-app-title">{{ formattedAppName }}</span>
    </v-card-title>
    <v-card-text>
      <span class="select-app-text">{{ releaseStatus }}</span>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
  /* eslint-disable no-undef */
  /* eslint-disable @typescript-eslint/no-unused-vars */
  import { type ComputedRef, computed } from 'vue';
  import type { IApp } from '@/interfaces/domain/iApp';
  import { ReleaseEnvironment } from '@/enums/releaseEnvironment';
  import { useDialogStore } from '@/stores/dialogStore';
  import { DialogType } from '@/enums/dialogType';
  import { App } from '@/models/domain/app';

  const props = withDefaults(
    defineProps<{
      app: IApp;
      index?: number;
      type?: string;
    }>(),
    {
      app: () => new App(),
      index: 0,
      type: 'Your Apps',
    },
  );
  const emit = defineEmits(['app-selected']);
  
  const dialogStore = useDialogStore();
  const { updateDialog } = dialogStore;

  const type: ComputedRef<string> = computed(() => props.type);

  const formattedAppName: ComputedRef<string> = computed(() => {
    if (props.app.name === null) {
      return '';
    } else if (props.app.name.length > 15) {
      let formattedName = '';
      const words = props.app.name?.split(' ');
      let index = 0;

      words?.forEach((word) => {
        if (index < 4) {
          if (formattedName === '') {
            formattedName = word;
          } else {
            formattedName = `${formattedName}\n${word}`;
          }
          index++;
        }
      });
      return formattedName;
    } else {
      return props.app.name;
    }
  });
  const releaseStatus: ComputedRef<string> = computed(() => {
    return props.app.environment === ReleaseEnvironment.LOCAL && props.app.isActive
      ? 'In Development'
      : props.app.environment === ReleaseEnvironment.TEST && props.app.isActive
        ? 'In Test'
        : props.app.environment === ReleaseEnvironment.STAGING && props.app.isActive
          ? 'In Staging'
          : props.app.environment === ReleaseEnvironment.PROD && props.app.isActive
            ? 'In Production'
            : !props.app.isActive
              ? 'Deactivated'
              : 'Invalid Status';
  });

  const selectApp = (): void => {
    emit('app-selected', props.app.id, null);
  };
  const evaluateColor = (value: number): string => {
    return value % 2 === 0 ? 'secondary' : 'error';
  };
  const navigateToApp = (): void => {
    if (!props.app.isActive) {
      updateDialog(
        'App has been deactivated',
        'This app is deactivated.',
        DialogType.OK
      );
    } else {
      let url: string = '';

      if (props.app.environment === ReleaseEnvironment.LOCAL) {
        if (!props.app.localUrl) {
          updateDialog(
            'Local URL not set',
            'The local URL for this app is not configured.',
            DialogType.OK
          );
          return;
        }
        url = props.app.localUrl!;
      } else if (props.app.environment === ReleaseEnvironment.TEST) {
        if (!props.app.testUrl) {
          updateDialog(
            'Test URL not set',
            'The test URL for this app is not configured.',
            DialogType.OK
          );
          return;
        }
        url = props.app.testUrl!;
      } else if (props.app.environment === ReleaseEnvironment.STAGING) {
        if (!props.app.stagingUrl) {
          updateDialog(
            'Staging URL not set',
            'The staging URL for this app is not configured.',
            DialogType.OK
          );
          return;
        }
        url = props.app.stagingUrl!;
      } else if (props.app.environment === ReleaseEnvironment.PROD) {
        if (!props.app.prodUrl) {
          updateDialog(
            'Production URL not set',
            'The production URL for this app is not configured.',
            DialogType.OK
          );
          return;
        }
        url = props.app.prodUrl!;
      }

      window.open(url, '_blank');
    }
  };
</script>

<style scoped lang="scss">
  .select-app-title {
    white-space: pre-wrap;
    text-decoration: none !important;
    color: white;
  }
  @media only screen and (max-width: 481px) {
    .app-button {
      min-height: 170px;
      max-height: 170px;
      min-width: 170px;
      max-width: 170px;
      margin-right: 10px;
      margin-bottom: 30px;
      cursor: pointer;
    }
  }
  @media only screen and (min-width: 482px) {
    .app-button {
      min-height: 200px;
      max-height: 200px;
      min-width: 200px;
      max-width: 200px;
      margin-right: 10px;
      margin-bottom: 30px;
      cursor: pointer;
    }
  }
  .secondary {
    color: white;
  }
  .error {
    color: white;
  }
</style>
