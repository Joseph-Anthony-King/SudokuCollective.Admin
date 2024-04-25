import { type ComputedRef, computed, type Ref, ref, toRaw } from 'vue';
import { defineStore } from 'pinia';
import { ValuesService } from '@/services/valuesService';
import type { IServicePayload } from '@/interfaces/infrastructure/iServicePayload';
import { DropdownItem } from '@/models/infrastructure/dropdownItem';
import { GameStates } from '@/utilities/dropdowns/gameStates';
import { Difficulty } from '@/models/domain/difficulty';
import { GalleryApp } from '@/models/domain/galleryApp';

export const useValueStore = defineStore('valueStore', () => {
  //#region State
  const difficulties: Ref<Array<Difficulty> | null> = ref(null);
  const releaseEnvironments: Ref<Array<DropdownItem> | null> = ref(null);
  const sortValues: Ref<Array<DropdownItem> | null> = ref(null);
  const timeFrames: Ref<Array<DropdownItem> | null> = ref(null);
  const gameStates: Ref<Array<DropdownItem> | null> = ref(null);
  const gallery: Ref<Array<GalleryApp> | null> = ref(null);
  const missionStatement: Ref<string | null> = ref(null);
  const storeExpirationDate: Ref<Date> = ref(new Date());
  //#endregion

  //#region Getters
  const getDifficulties: ComputedRef<Array<Difficulty>> = computed(() =>
    difficulties.value !== null ? toRaw(difficulties.value) : new Array<Difficulty>(),
  );
  const getReleaseEnvironments: ComputedRef<Array<DropdownItem>> = computed(() =>
    releaseEnvironments.value !== null
      ? toRaw(releaseEnvironments.value)
      : new Array<DropdownItem>(),
  );
  const getSortValues: ComputedRef<Array<DropdownItem>> = computed(() =>
    sortValues.value !== null ? toRaw(sortValues.value) : new Array<DropdownItem>(),
  );
  const getTimeFrames: ComputedRef<Array<DropdownItem>> = computed(() =>
    timeFrames.value !== null ? toRaw(timeFrames.value) : new Array<DropdownItem>(),
  );
  const getGameStates: ComputedRef<Array<DropdownItem>> = computed(() =>
    gameStates.value !== null ? toRaw(gameStates.value) : new Array<DropdownItem>(),
  );
  const getGallery: ComputedRef<Array<GalleryApp>> = computed(() =>
    gallery.value !== null ? toRaw(gallery.value) : new Array<GalleryApp>(),
  );
  const getMissionStatement: ComputedRef<string> = computed(() =>
    missionStatement.value ? toRaw(missionStatement.value) : '',
  );
  //#endregion

  //#region Actions
  const initializeStoreAsync = async (): Promise<void> => {
    if (new Date() > storeExpirationDate.value) {
      const response: IServicePayload = await ValuesService.getValuesAsync();

      if (response.missionStatement) {
        missionStatement.value = response.missionStatement;
      }

      if (response.difficulties) {
        difficulties.value = response.difficulties;
      }

      if (response.releaseEnvironments) {
        releaseEnvironments.value = response.releaseEnvironments;
      }

      if (response.sortValues) {
        sortValues.value = response.sortValues;
      }

      if (response.timeFrames) {
        timeFrames.value = response.timeFrames;
      }

      if (response.gallery) {
        gallery.value = response.gallery;
      }

      gameStates.value = GameStates;

      storeExpirationDate.value?.setDate(new Date().getDate() + 1);
    }
  };
  //#endregion

  return {
    difficulties,
    releaseEnvironments,
    sortValues,
    timeFrames,
    gameStates,
    gallery,
    missionStatement,
    storeExpirationDate,
    getDifficulties,
    getReleaseEnvironments,
    getSortValues,
    getTimeFrames,
    getGameStates,
    getGallery,
    getMissionStatement,
    initializeStoreAsync,
  };
});
