<template>
  <v-card class='justify-center text-center'>
    <v-card-title>
      <span class='headline'>{{ title }}</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols='12'>
            <span>{{ message }}</span>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-row :dense='true'>
        <v-col>
          <v-btn color='blue darken-1' text @click='confirmedHandler'>
            Yes
          </v-btn>
        </v-col>
        <v-col>
          <v-btn color='blue darken-1' text @click='notConfirmedHandlder'>
            No
          </v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script setup lang='ts'>
// eslint-disable-next-line
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  message: {
    type: String,
    default: '',
  },
});
const emit = defineEmits(['action-confirmed', 'action-not-confirmed']);

const confirmedHandler = (): void => {
  emit('action-confirmed', null, null);
};
const notConfirmedHandlder = (): void => {
  emit('action-not-confirmed', null, null);
};   
</script>
