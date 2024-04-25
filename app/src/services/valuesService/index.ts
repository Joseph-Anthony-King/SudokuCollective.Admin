import { IndexPort } from '@/ports/indexPort';
import { ValuesPort } from '@/ports/valuesPort';
import { Difficulty } from '@/models/domain/difficulty';
import { GalleryApp } from '@/models/domain/galleryApp';
import { DropdownItem } from '@/models/infrastructure/dropdownItem';
import type { IServicePayload } from '@/interfaces/infrastructure/iServicePayload';
import { type AxiosResponse, AxiosError } from 'axios';
import { StaticServiceMethods } from '@/services/common';

export class ValuesService {
  static async getValuesAsync(): Promise<IServicePayload> {
    const result: IServicePayload = {};

    try {
      const indexResponse = (await IndexPort.getMissionStatementAsync()) as AxiosResponse;

      if (indexResponse instanceof Error) {
        throw indexResponse as unknown as AxiosError;
      }

      const valuesResponse = (await ValuesPort.getValuesAsync()) as AxiosResponse;

      if (valuesResponse instanceof Error) {
        throw valuesResponse as unknown as AxiosError;
      }

      if (indexResponse) {
        result.missionStatement = indexResponse.data.missionStatement.replace(
          '/swagger/index.html',
          `${process.env.VITE_APP_API_URL}swagger/index.html`,
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
                difficulty.difficultyLevel,
              ),
            );
          },
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
                releaseEnvironment.appliesTo,
              ),
            );
          },
        );

        result.releaseEnvironments = releaseEnvironments;

        valuesResponse.data.payload[0].sortValues.forEach(
          (sortValue: {
            label: string | undefined;
            value: number | undefined;
            appliesTo: string[] | undefined;
          }) => {
            sortValues.push(
              new DropdownItem(sortValue.label, sortValue.value, sortValue.appliesTo),
            );
          },
        );

        result.sortValues = sortValues;

        valuesResponse.data.payload[0].timeFrames.forEach(
          (timeFrame: {
            label: string | undefined;
            value: number | undefined;
            appliesTo: string[] | undefined;
          }) => {
            timeFrames.push(
              new DropdownItem(timeFrame.label, timeFrame.value, timeFrame.appliesTo),
            );
          },
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
                galleryApp.dateUpdated,
              ),
            );
          },
        );

        result.gallery = gallery;
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('error: ', error);
      }
      if (error instanceof AxiosError && error.response) {
        result.isSuccess = error.response.data.isSuccess;
        StaticServiceMethods.processFailedResponse(error.response);
      } else {
        result.isSuccess = false;
      }
    }

    return result;
  }
}
