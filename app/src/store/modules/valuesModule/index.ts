import { Commit } from 'vuex';
import { IValuesState } from '@/interfaces/store/iValuesState';
import { MutationTypes } from '@/store/modules/valuesModule/mutationTypes';
import { ValuesService } from '@/services/valuesService';
import { IServicePayload } from '@/interfaces/infrastructure/iServicePayload';
import { DropdownItem } from '@/models/infrastructure/dropdownItem';
import { Difficulty } from '@/models/domain/difficulty';
import { GalleryApp } from '@/models/domain/galleryApp';
import { GameStates } from '@/utilities/dropdowns/gameStates';

const valuesModule = {
  namespaced: true,
  state: (): IValuesState => ({
    difficulties: null,
    releaseEnvironments: null,
    sortValues: null,
    timeFrames: null,
    gameStates: null,
    gallery: null,
    missionStatement: '',
    expirationDate: new Date(),
  }),
  getters: {
    getState(state: IValuesState): IValuesState {
      return state;
    },
    getDifficulties(state: IValuesState): Array<Difficulty> | null {
      return state.difficulties;
    },
    getReleaseEnvironments(state: IValuesState): Array<DropdownItem> | null {
      return state.releaseEnvironments;
    },
    getSortValues(state: IValuesState): Array<DropdownItem> | null {
      return state.sortValues;
    },
    getAppliedSortValue(state: IValuesState, apply: string): Array<DropdownItem> | null {
      if (state.sortValues !== null) {
        return state.sortValues.filter(
          sortValue => { 
            return sortValue.appliesTo.includes(apply)
          });
      } else {
        return null;
      }
    },
    getTimeFrames(state: IValuesState): Array<DropdownItem> | null {
      return state.timeFrames;
    },
    getGameStates(state: IValuesState): Array<DropdownItem> | null {
      return state.gameStates
    },
    getGallery(state: IValuesState): Array<GalleryApp> | null {
      return state.gallery;
    },
    getMissionStatement(state: IValuesState): string | null {
      return state.missionStatement;
    }
  },
  mutations: {
    [MutationTypes.UPDATEDIFFICULTIES](state: IValuesState, difficulties: Difficulty[]): void {
      state.difficulties = difficulties;
    },
    [MutationTypes.UPDATERELEASEENVIRONMENTS](state: IValuesState, releaseEnvironments: DropdownItem[]): void {
      state.releaseEnvironments = releaseEnvironments;
    },
    [MutationTypes.UPDATESORTVALUES](state: IValuesState, sortValues: DropdownItem[]): void {
      state.sortValues = sortValues;
    },
    [MutationTypes.UPDATETIMEFRAMES](state: IValuesState, timeFrames: DropdownItem[]): void {
      state.timeFrames = timeFrames;
    },
    [MutationTypes.UPDATEGAMESTATES](state: IValuesState, gameStates: DropdownItem[]): void {
      state.gameStates = gameStates;
    },
    [MutationTypes.UPDATEGALLERY](state: IValuesState, gallery: GalleryApp[]): void {
      state.gallery = gallery;
    },
    [MutationTypes.UPDATEMISSIONSTATEMENT](state: IValuesState, missionStatement: string): void {
      state.missionStatement = missionStatement;
    },
    [MutationTypes.UPDATEEXPIRATIONDATE](state: IValuesState): void {
      const currentDate = new Date();
      if (state.expirationDate !== null) {
        state.expirationDate.setDate(currentDate.getDate() + 1);
      }
    },
  },
  actions: {
    async initializeModuleAsync({ commit, state }: { commit: Commit, state: IValuesState }, valuesService: ValuesService): Promise<void> {

      if (state.expirationDate !== null && new Date() > state.expirationDate) {

        const result: IServicePayload = await valuesService.getValuesAsync();
  
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

        commit(MutationTypes.UPDATEGAMESTATES, GameStates);
        
        commit(MutationTypes.UPDATEEXPIRATIONDATE);
      }
    }
  }
}

export default valuesModule;
