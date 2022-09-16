import { Commit } from 'vuex';
import { IValuesState } from '@/interfaces/store/IValuesState';
import { ValuesService } from '@/services/ValuesService';
import { IServicePayload } from '@/interfaces/infrastructure/IServicePayload';
import { DropdownItem } from '@/models/infrastructure/DropdownItem';
import { Difficulty } from '@/models/domain/Difficulty';
import { GalleryApp } from '@/models/domain/GalleryApp';

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
        updateDifficulties(state: IValuesState, difficulties: Difficulty[]) {
          state.difficulties = difficulties;
        },
        updateReleaseEnvironments(state: IValuesState, releaseEnvironments: DropdownItem[]) {
          state.releaseEnvironments = releaseEnvironments;
        },
        updateSortValues(state: IValuesState, sortValues: DropdownItem[]) {
          state.sortValues = sortValues;
        },
        updateTimeFrames(state: IValuesState, timeFrames: DropdownItem[]) {
          state.timeFrames = timeFrames;
        },
        updateGallery(state: IValuesState, gallery: GalleryApp[]) {
          state.gallery = gallery;
        },
        updateMissionStatement(state: IValuesState, missionStatement: string) {
          state.missionStatement = missionStatement;
        },
        updateExpirationDate(state: IValuesState) {
          const currentDate = new Date();
          state.expirationDate.setDate(currentDate.getDate() + 1);
        },
    },
    actions: {
        async getValues({ commit, state }: { commit: Commit, state: IValuesState }, valuesService: ValuesService) {
    
          if (new Date() > state.expirationDate) {
    
            const result: IServicePayload = await valuesService.getValues();
      
            if (result.missionStatement) {
              commit('updateMissionStatement', result.missionStatement);
            }
      
            if (result.difficulties) {
              commit('updateDifficulties', result.difficulties);
            }
      
            if (result.releaseEnvironment) {
              commit('updateReleaseEnvironments', result.releaseEnvironment);
            }
      
            if (result.sortValues) {
              commit('updateSortValues', result.sortValues);
            }
      
            if (result.timeFrames) {
              commit('updateTimeFrames', result.timeFrames);
            }
      
            if (result.gallery) {
              commit('updateGallery', result.gallery);
            }
            
            commit('updateExpirationDate');
          }
        }
    }
}

export default valuesModule;