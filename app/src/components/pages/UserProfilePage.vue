<template>
  <v-container fluid>
    <v-card elevation='6' class='mx-auto'>
      <v-card-text>
        <v-container fluid>
          <user-profile-form />
        </v-container>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang='ts'>
import UserProfileForm from '@/components/forms/UserProfileForm.vue';
</script>
