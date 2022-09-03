import { createStore } from "vuex"
import { IndexService } from "@/services/IndexService"
import { ValuesService } from "../services/ValuesService"
import { Difficulty } from "@/models/Difficulty"
import { DropdownItem } from "@/models/DropdownItem"
import { GalleryApp } from "@/models/GalleryApp"

export default createStore({
  state: {
    difficulties: [] as Array<Difficulty>,
    releaseEnvironments: [] as Array<DropdownItem>,
    sortValues: [] as Array<DropdownItem>,
    timeFrames: [] as Array<DropdownItem>,
    gallery: [] as Array<GalleryApp>,
    missionStatement: "",
  },
  getters: {
    getState(state) {
      return state;
    },
    getDifficulties(state) {
      return state.difficulties;
    },
    getReleaseEnvironments(state) {
      return state.releaseEnvironments;
    },
    getSortValues(state) {
      return state.sortValues;
    },
    getTimeFrames(state) {
      return state.timeFrames;
    },
    getGallery(state) {
      return state.gallery;
    },
    getMissionStatement(state) {
      return state.missionStatement;
    }
  },
  mutations: {
    addDifficulties(state, difficulties: Difficulty[]) {
      state.difficulties = difficulties;
    },
    addReleaseEnvironments(state, releaseEnvironments: DropdownItem[]) {
      state.releaseEnvironments = releaseEnvironments;
    },
    addSortValues(state, sortValues: DropdownItem[]) {
      state.sortValues = sortValues;
    },
    addTimeFrames(state, timeFrames: DropdownItem[]) {
      state.timeFrames = timeFrames;
    },
    addGallery(state, gallery: GalleryApp[]) {
      state.gallery = gallery;
    },
    addMissionStatement(state, missionStatement: string) {
      state.missionStatement = missionStatement;
    }
  },
  actions: {
    async getValues({ commit }, payload) {

      const { indexService }: { indexService: IndexService } = payload;
      const { valuesService }: { valuesService: ValuesService } = payload;

      const indexResponse = await indexService.getMissionStatement();
      const valuesResponse = await valuesService.getValues();

      console.log(indexResponse)

      if (indexResponse) {
        commit("addMissionStatement", indexResponse.data.missionStatement.replace("/swagger/index.html", "https://localhost:5001/swagger/index.html"));
      }

      if (valuesResponse.data.isSuccess) {
      
        const difficulties: Difficulty[] = [];
        const releaseEnvironments: DropdownItem[] = [];
        const sortValues: DropdownItem[] = [];
        const timeFrames: DropdownItem[] = [];
        const gallery: GalleryApp[] = [];

        valuesResponse.data.payload[0].difficulties.forEach((difficulty: { id: number | undefined; name: string | undefined; displayName: string | undefined; difficultyLevel: number | undefined; }) => {
          difficulties.push(new Difficulty(difficulty.id, difficulty.name, difficulty.displayName, difficulty.difficultyLevel));
        });
  
        valuesResponse.data.payload[0].releaseEnvironments.forEach((releaseEnvironment: { label: string | undefined; value: number | undefined; appliesTo: string[] | undefined; }) => {
          releaseEnvironments.push(new DropdownItem(releaseEnvironment.label, releaseEnvironment.value, releaseEnvironment.appliesTo));
        });

        valuesResponse.data.payload[0].sortValues.forEach((sortValue: { label: string | undefined; value: number | undefined; appliesTo: string[] | undefined; }) => {
          sortValues.push(new DropdownItem(sortValue.label, sortValue.value, sortValue.appliesTo))
        });

        valuesResponse.data.payload[0].timeFrames.forEach((timeFrame: { label: string | undefined; value: number | undefined; appliesTo: string[] | undefined; }) => {
          timeFrames.push(new DropdownItem(timeFrame.label, timeFrame.value, timeFrame.appliesTo))
        });

        valuesResponse.data.payload[0].gallery.forEach((galleryApp: { id: number | undefined; name: string | undefined; url: string | undefined; sourceCodeUrl: string | undefined; createdBy: string | undefined; userCount: number | undefined; dateCreated: string | undefined; dateUpdated: string | undefined; }) => {
          gallery.push(new GalleryApp(galleryApp.id, galleryApp.name, galleryApp.url, galleryApp.sourceCodeUrl, galleryApp.createdBy, galleryApp.userCount, galleryApp.dateCreated, galleryApp.dateUpdated));
        });

        commit("addDifficulties", difficulties);
        commit("addReleaseEnvironments", releaseEnvironments);
        commit("addSortValues", sortValues);
        commit("addTimeFrames", timeFrames);
        commit("addGallery", gallery);
      } else {
        console.log(valuesResponse);
      }
    }
  },
  modules: {
  }
})
