import { IndexConnector } from '@/connectors/IndexConnector';
import { ValuesConnector } from '@/connectors/ValuesConnector';
import { Difficulty } from '@/models/domain/Difficulty';
import { GalleryApp } from '@/models/domain/GalleryApp';
import { DropdownItem } from '@/models/infrastructure/DropdownItem';
import { IServicePayload } from '@/interfaces/infrastructure/IServicePayload';

export class ValuesService {
  indexConnector: IndexConnector;
  valuesConnector: ValuesConnector;

  constructor(
    indexConnector: IndexConnector,
    valuesConnector: ValuesConnector
  ) {
    this.indexConnector = indexConnector;
    this.valuesConnector = valuesConnector;
  }

  async getValues(): Promise<IServicePayload> {
    const result: IServicePayload = {};
    const indexResponse = await this.indexConnector.getMissionStatement();
    const valuesResponse = await this.valuesConnector.getValues();

    try {
      if (indexResponse) {
        result.missionStatement = indexResponse.data.missionStatement.replace(
          '/swagger/index.html',
          `${process.env.VUE_APP_API_URL}/swagger/index.html`
        );
      }

      if (valuesResponse.data.isSuccess) {
        const difficulties: Difficulty[] = [];
        const releaseEnvironments: DropdownItem[] = [];
        const sortValues: DropdownItem[] = [];
        const timeFrames: DropdownItem[] = [];
        const gallery: GalleryApp[] = [];

        valuesResponse.data.payload[0].difficulties.forEach(
          (difficulty: {
            id: number | undefined;
            name: string | undefined;
            displayName: string | undefined;
            difficultyLevel: number | undefined;
          }) => {
            difficulties.push(
              new Difficulty(
                difficulty.id,
                difficulty.name,
                difficulty.displayName,
                difficulty.difficultyLevel
              )
            );
          }
        );

        result.difficulties = difficulties;

        valuesResponse.data.payload[0].releaseEnvironments.forEach(
          (releaseEnvironment: {
            label: string | undefined;
            value: number | undefined;
            appliesTo: string[] | undefined;
          }) => {
            releaseEnvironments.push(
              new DropdownItem(
                releaseEnvironment.label,
                releaseEnvironment.value,
                releaseEnvironment.appliesTo
              )
            );
          }
        );

        result.releaseEnvironments = releaseEnvironments;

        valuesResponse.data.payload[0].sortValues.forEach(
          (sortValue: {
            label: string | undefined;
            value: number | undefined;
            appliesTo: string[] | undefined;
          }) => {
            sortValues.push(
              new DropdownItem(
                sortValue.label,
                sortValue.value,
                sortValue.appliesTo
              )
            );
          }
        );

        result.sortValues = sortValues;

        valuesResponse.data.payload[0].timeFrames.forEach(
          (timeFrame: {
            label: string | undefined;
            value: number | undefined;
            appliesTo: string[] | undefined;
          }) => {
            timeFrames.push(
              new DropdownItem(
                timeFrame.label,
                timeFrame.value,
                timeFrame.appliesTo
              )
            );
          }
        );

        result.timeFrames = timeFrames;

        valuesResponse.data.payload[0].gallery.forEach(
          (galleryApp: {
            id: number | undefined;
            name: string | undefined;
            url: string | undefined;
            sourceCodeUrl: string | undefined;
            createdBy: string | undefined;
            userCount: number | undefined;
            dateCreated: string | undefined;
            dateUpdated: string | undefined;
          }) => {
            gallery.push(
              new GalleryApp(
                galleryApp.id,
                galleryApp.name,
                galleryApp.url,
                galleryApp.sourceCodeUrl,
                galleryApp.createdBy,
                galleryApp.userCount,
                galleryApp.dateCreated,
                galleryApp.dateUpdated
              )
            );
          }
        );

        result.gallery = gallery;
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.log(error);
      }
    }

    return result;
  }
}
