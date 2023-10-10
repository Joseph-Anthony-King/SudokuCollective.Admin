import { ComputedRef, Ref, computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { ValuesService } from '@/services/valuesService';
import { IServicePayload } from '@/interfaces/infrastructure/iServicePayload';
import { DropdownItem } from '@/models/infrastructure/dropdownItem';
import { GameStates } from '@/utilities/dropdowns/gameStates';
import { Difficulty } from '@/models/domain/difficulty';
import { GalleryApp } from '@/models/domain/galleryApp';

export const useValuesStore = defineStore('valuesStore', () => {
	const difficulties: Ref<Array<Difficulty> | undefined> = ref(undefined);
	const releaseEnvironments: Ref<Array<DropdownItem> | undefined> = ref(undefined);
	const sortValues: Ref<Array<DropdownItem> | undefined> = ref(undefined);
	const timeFrames: Ref<Array<DropdownItem> | undefined> = ref(undefined);
	const gameStates: Ref<Array<DropdownItem> | undefined> = ref(undefined);
	const gallery: Ref<Array<GalleryApp> | undefined> = ref(undefined);
	const missionStatement: Ref<string | undefined> = ref(undefined);
	const storeExpirationDate: Ref<Date> = ref(new Date());

	const getDifficulties: ComputedRef<Array<Difficulty>> = computed(() =>
		difficulties.value !== undefined ? difficulties.value : new Array<Difficulty>());
	const getReleaseEnvironments: ComputedRef<Array<DropdownItem>> = computed(() =>
		releaseEnvironments.value !== undefined ? releaseEnvironments.value : new Array<DropdownItem>());
	const getSortValues: ComputedRef<Array<DropdownItem>> = computed(() =>
		sortValues.value !== undefined ? sortValues.value : new Array<DropdownItem>());
	const getTimeFrames: ComputedRef<Array<DropdownItem>> = computed(() => 
		timeFrames.value !== undefined ? timeFrames.value : new Array<DropdownItem>());
	const getGameStates: ComputedRef<Array<DropdownItem>> = computed(() => 
		gameStates.value !== undefined ? gameStates.value : new Array<DropdownItem>());
	const getGallery: ComputedRef<Array<GalleryApp>> = computed(() => 
		gallery.value !== undefined ? gallery.value : new Array<GalleryApp>());
	const getMissionStatement: ComputedRef<string> = computed(() => missionStatement.value ? missionStatement.value : '');
	
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
			
			storeExpirationDate.value?.setDate((new Date()).getDate() + 1);
		}
	}

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
		initializeStoreAsync
	}
});
