import { Commit } from 'vuex';
import { IValuesState } from '@/interfaces/store/iValuesState';
import { MutationTypes } from '@/store/modules/valuesModule/mutationTypes';
import { ValuesService } from '@/services/valuesService';
import { IServicePayload } from '@/interfaces/infrastructure/iServicePayload';
import { DropdownItem } from '@/models/infrastructure/dropdownItem';
import { Difficulty } from '@/models/domain/difficulty';
import { GalleryApp } from '@/models/domain/galleryApp';

const valuesModule = {
  namespaced: true,
  state: (): IValuesState => ({
    difficulties: Array<Difficulty>(),
    releaseEnvironments: Array<DropdownItem>(),
    sortValues: Array<DropdownItem>(),
    timeFrames: Array<DropdownItem>(),
    gallery: Array<GalleryApp>(),
    missionStatement: '',
    expirationDate: new Date(),
  }),
  getters: {
    getState(state: IValuesState) {
      return state;
    },
    getDifficulties(state: IValuesState) {
      return state.difficulties;
    },
    getReleaseEnvironments(state: IValuesState) {
      return state.releaseEnvironments;
    },
    getSortValues(state: IValuesState) {
      return state.sortValues;
    },
    getAppliedSortValue(state: IValuesState, apply: string) {
      return state.sortValues.filter(
        sortValue => { 
          return sortValue.appliesTo.includes(apply)
        });
    },
    getTimeFrames(state: IValuesState) {
      return state.timeFrames;
    },
    getGallery(state: IValuesState) {
      return state.gallery;
    },
    getMissionStatement(state: IValuesState) {
      return state.missionStatement;
    }
  },
  mutations: {
    [MutationTypes.UPDATEDIFFICULTIES](state: IValuesState, difficulties: Difficulty[]) {
      state.difficulties = difficulties;
    },
    [MutationTypes.UPDATERELEASEENVIRONMENTS](state: IValuesState, releaseEnvironments: DropdownItem[]) {
      state.releaseEnvironments = releaseEnvironments;
    },
    [MutationTypes.UPDATESORTVALUES](state: IValuesState, sortValues: DropdownItem[]) {
      state.sortValues = sortValues;
    },
    [MutationTypes.UPDATETIMEFRAMES](state: IValuesState, timeFrames: DropdownItem[]) {
      state.timeFrames = timeFrames;
    },
    [MutationTypes.UPDATEGALLERY](state: IValuesState, gallery: GalleryApp[]) {
      state.gallery = gallery;
    },
    [MutationTypes.UPDATEMISSIONSTATEMENT](state: IValuesState, missionStatement: string) {
      state.missionStatement = missionStatement;
    },
    [MutationTypes.UPDATEEXPIRATIONDATE](state: IValuesState) {
      const currentDate = new Date();
      state.expirationDate.setDate(currentDate.getDate() + 1);
    },
  },
  actions: {
    async initializeModule({ commit, state }: { commit: Commit, state: IValuesState }, valuesService: ValuesService) {

      if (new Date() > state.expirationDate) {

        const result: IServicePayload = await valuesService.getValues();
  
        if (result.missionStatement) {
          commit(MutationTypes.UPDATEMISSIONSTATEMENT, result.missionStatement);
        }
  
        if (result.difficulties) {
          commit(MutationTypes.UPDATEDIFFICULTIES, result.difficulties);
        }
  
        if (result.releaseEnvironment) {
          commit(MutationTypes.UPDATERELEASEENVIRONMENTS, result.releaseEnvironment);
        }
  
        if (result.sortValues) {
          commit(MutationTypes.UPDATESORTVALUES, result.sortValues);
        }
  
        if (result.timeFrames) {
          commit(MutationTypes.UPDATETIMEFRAMES, result.timeFrames);
        }
  
        if (result.gallery) {
          commit(MutationTypes.UPDATEGALLERY, result.gallery);
        }
        
        commit(MutationTypes.UPDATEEXPIRATIONDATE);
      }
    }
  }
}

export default valuesModule;
