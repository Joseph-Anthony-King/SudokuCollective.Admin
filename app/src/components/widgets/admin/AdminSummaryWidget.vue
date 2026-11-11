<template>
  <div class="gauge-rows">
    <v-row justify="center">
      <v-col
        class="gauge-column"
        cols="6"
        lg="3">
        <gauge-widget
          labelProp="Apps"
          :valueProp="adminSummary.applicationsCount" />
      </v-col>
      <v-col
        class="gauge-column"
        cols="6"
        lg="3">
        <gauge-widget
          labelProp="Users"
          :valueProp="adminSummary.usersCount" />
      </v-col>
      <v-col
        class="gauge-column"
        cols="6"
        lg="3">
        <gauge-widget
          labelProp="Games"
          :valueProp="adminSummary.gamesCount" />
      </v-col>
      <v-col
        class="gauge-column"
        cols="6"
        lg="3">
        <gauge-widget
          labelProp="Solutions"
          :valueProp="adminSummary.solutionsCount" />
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col
        class="gauge-column"
        cols="6"
        lg="3">
        <gauge-widget
          labelProp="Difficulties"
          :valueProp="adminSummary.difficultiesCount" />
      </v-col>
      <v-col
        class="gauge-column"
        cols="6"
        lg="3">
        <gauge-widget
          labelProp="Roles"
          :valueProp="adminSummary.rolesCount" />
      </v-col>
      <v-col
        class="gauge-column"
        cols="6"
        lg="3">
        <gauge-widget
          labelProp="Email Confirmations"
          :valueProp="adminSummary.emailConfirmationsCount" />
      </v-col>
      <v-col
        class="gauge-column"
        cols="6"
        lg="3">
        <gauge-widget
          labelProp="Password Resets"
          :valueProp="adminSummary.passwordResetsCount" />
      </v-col>
    </v-row>
    <site-administration-summary-widget />
  </div>
</template>

<script setup lang="ts">
  /* eslint-disable no-undef */
  import { storeToRefs } from 'pinia';
  import { useAdminStore } from '@/stores/adminStore';
  import GaugeWidget from '@/components/widgets/admin/GaugeWidget.vue';
  import SiteAdministrationSummaryWidget from '@/components/widgets/admin/SiteAdministrationSummaryWidget.vue';

  const adminStore = useAdminStore();
  const { getAdminSummary } = storeToRefs(adminStore);
  const adminSummary = getAdminSummary;
</script>

<style scoped>
  .gauge-rows {
    border: 1px solid #bdbdbd;
    border-radius: 4px;
    padding: 8px;
  }

  .gauge-rows :deep(.v-row) {
    margin-inline: 0;
  }

  .gauge-rows :deep(.gauge-widget) {
    margin-inline: auto;
  }

  @media (max-width: 579.98px) {
    .gauge-rows :deep(.gauge-column) {
      flex: 0 0 100%;
      max-width: 100%;
    }
  }
</style>
