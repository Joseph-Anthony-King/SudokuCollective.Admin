<template>
  <v-container>
    <v-tooltip
      open-delay="2000"
      location="bottom">
      <template #activator="{ props }">
        <v-card
          v-bind="props"
          class="gauge-widget"
          tabindex="0">
          <svg
            viewBox="0 0 200 140"
            role="img"
            :aria-label="`${value} ${label}`">
            <path
              class="gauge-track"
              :d="trackPath" />
            <path
              class="gauge-value"
              :d="valuePath" />
          </svg>
          <v-card-title class="justify-center text-center">{{ value }} {{ label }}</v-card-title>
        </v-card>
      </template>
      <span>Site wide there are {{ value }} {{ label }}</span>
    </v-tooltip>
  </v-container>
</template>

<script setup lang="ts">
  import { computed } from 'vue';

  const props = withDefaults(
    defineProps<{
      labelProp?: string;
      valueProp?: number;
    }>(),
    {
      labelProp: '',
      valueProp: 0,
    },
  );

  const thresholds = [10, 50, 100, 500, 1_000, 5_000, 10_000, 50_000, 100_000, 500_000, 1_000_000];
  const maxValue = computed(() => {
    const value = Math.max(0, props.valueProp);
    return (
      thresholds.find((threshold) => value <= threshold) ?? Math.ceil(value / 1_000_000) * 1_000_000
    );
  });
  const progress = computed(() => Math.min(Math.max(props.valueProp / maxValue.value, 0), 1));

  function gaugePath(fraction: number) {
    const startAngle = -110;
    const endAngle = startAngle + 220 * fraction;
    const radius = 75;
    const point = (angle: number) => {
      const radians = (angle * Math.PI) / 180;
      return {
        x: 100 + radius * Math.sin(radians),
        y: 100 - radius * Math.cos(radians),
      };
    };
    const start = point(startAngle);
    const end = point(endAngle);
    const largeArc = fraction > 180 / 220 ? 1 : 0;

    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`;
  }

  const trackPath = gaugePath(1);
  const valuePath = computed(() => gaugePath(progress.value));
  const value = computed(() => props.valueProp);
  const label = computed(() => props.labelProp);
</script>

<style scoped>
  svg {
    display: block;
    width: 100%;
  }

  .gauge-track,
  .gauge-value {
    fill: none;
    stroke-linecap: round;
    stroke-width: 16;
  }

  .gauge-track {
    stroke: #e0e0e0;
  }

  .gauge-value {
    stroke: #1976d2;
  }

  @media only screen and (max-width: 320px) {
    .gauge-widget {
      min-height: 150px;
      max-height: 150px;
      min-width: 150px;
      max-width: 150px;
      cursor: pointer;
    }
  }
  @media only screen and (min-width: 321px) and (max-width: 430px) {
    .gauge-widget {
      min-height: 170px;
      max-height: 170px;
      min-width: 170px;
      max-width: 170px;
      cursor: pointer;
    }
  }
  @media only screen and (min-width: 431px) and (max-width: 600px) {
    .gauge-widget {
      min-height: 190px;
      max-height: 190px;
      min-width: 190px;
      max-width: 190px;
      cursor: pointer;
    }
  }
  @media only screen and (min-width: 601px) and (max-width: 1919px) {
    .gauge-widget {
      min-height: 220px;
      max-height: 220px;
      min-width: 220px;
      max-width: 220px;
      cursor: pointer;
    }
  }
  @media only screen and (min-width: 1920px) and (max-width: 2500px) {
    .gauge-widget {
      min-height: 250px;
      max-height: 250px;
      min-width: 250px;
      max-width: 250px;
      cursor: pointer;
    }
  }
  @media only screen and (min-width: 2501px) {
    .gauge-widget {
      min-height: 300px;
      max-height: 300px;
      min-width: 300px;
      max-width: 300px;
      cursor: pointer;
    }
  }
</style>
