import { ComputedRef, Ref, computed, ref } from "vue";
import { defineStore } from "pinia";
import { ValuesService } from "@/services/valuesService";
import { Difficulty } from "@/models/domain/difficulty";
import { GalleryApp } from "@/models/domain/galleryApp";
import { DropdownItem } from "@/models/infrastructure/dropdownItem";
import { IServicePayload } from "@/interfaces/infrastructure/iServicePayload";
import { GameStates } from "@/utilities/dropdowns/gameStates";

export const useValuesStore = defineStore("valuesStore", () => {
	const difficulties: Ref<Array<Difficulty> | null> = ref(null);
	const releaseEnvironments: Ref<Array<DropdownItem> | null> = ref(null);
	const sortValues: Ref<Array<DropdownItem> | null> = ref(null);
	const timeFrames: Ref<Array<DropdownItem> | null> = ref(null);
	const gameStates: Ref<Array<DropdownItem> | null> = ref(null);
	const gallery: Ref<Array<GalleryApp> | null> = ref(null);
	const missionStatement = ref("");
	const expirationDate = new Date();

	const getDifficulties: ComputedRef<Array<Difficulty>> = computed(() =>
		difficulties.value !== null ? difficulties.value : new Array<Difficulty>());
	const getReleaseEnvironments: ComputedRef<Array<DropdownItem>> = computed(() =>
		releaseEnvironments.value !== null ? releaseEnvironments.value : new Array<DropdownItem>());
	const getSortValues: ComputedRef<Array<DropdownItem>> = computed(() =>
		sortValues.value !== null ? sortValues.value : new Array<DropdownItem>());
	const getTimeFrames: ComputedRef<Array<DropdownItem>> = computed(() => 
		timeFrames.value !== null ? timeFrames.value : new Array<DropdownItem>());
	const getGameStates: ComputedRef<Array<DropdownItem>> = computed(() => 
		gameStates.value !== null ? gameStates.value : new Array<DropdownItem>());
	const getGallery: ComputedRef<Array<GalleryApp>> = computed(() => 
		gallery.value !== null ? gallery.value : new Array<GalleryApp>());
	const getMissionStatement: ComputedRef<string> = computed(() => missionStatement.value);
	
	const initializeAsync = async (): Promise<void> => {

		if (new Date() > expirationDate) {

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
			
			expirationDate.setDate((new Date()).getDate() + 1);
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
		getDifficulties,
		getReleaseEnvironments,
		getSortValues,
		getTimeFrames,
		getGameStates,
		getGallery,
		getMissionStatement,
		initializeAsync
	}
}, {
	persist: true
});
