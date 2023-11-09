/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError, AxiosResponse } from "axios";
import { AppsPort } from "@/ports/appsPort";
import { IServicePayload } from "@/interfaces/infrastructure/iServicePayload";
import { StaticServiceMethods } from "@/services/common";
import { IApp } from "@/interfaces/domain/iApp";
import { App } from "@/models/domain/app";
import { User } from "@/models/domain/user";

export class AppsService {
  static getMyAppsAsync = async (): Promise<IServicePayload> => {
    const result: IServicePayload = {};

    try {
      const response = (await AppsPort.getMyAppsAsync()) as AxiosResponse;

      if (response.data.isSuccess) {
        result.isSuccess = response.data.isSuccess;
        result.message = response.data.message;
        result.apps = Array<IApp>();
        response.data.payload.forEach((app:any) => {
          const users = Array<User>();

          app.users.forEach((user:any) => {
            users.push(new User(
              user.id,
              user.userName,
              user.firstName,
              user.lastName,
              user.nickname,
              user.fullName,
              user.email,
              user.isEmailConfirmed,
              user.receivedRequestToUpdateEmail,
              user.receivedRequestToUpdatePassword,
              user.isActive,
              user.isSuperUser,
              user.isAdmin,
              user.dateCreated,
              user.dateUpdated
            ));
          });

          result.apps.push(new App(
            app.id,
            app.name,
            app.license,
            app.ownerId,
            app.localUrl,
            app.stagingUrl,
            app.qaUrl,
            app.prodUrl,
            app.sourceCodeUrl,
            app.isActive,
            app.environment,
            app.permitSuperUserAccess,
            app.permitCollectiveLogins,
            app.disableCustomUrls,
            app.customEmailConfirmationAction,
            app.customPasswordResetAction,
            app.useCustomSMTPServer,
            app.smtpServerSettings,
            app.userCount,
            app.timeFrame,
            app.accessDuration,
            app.displayInGallery,
            app.dateCreated,
            app.dateUpdated,
            users
          ));
        });
      } else {
        result.isSuccess = response.data.isSuccess;
        StaticServiceMethods.processFailedResponse(response);
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("error: ", error);
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
  
  static getMyRegisteredAppsAsync = async (): Promise<IServicePayload> => {
    const result: IServicePayload = {};

    try {
      const response = (await AppsPort.getMyRegisteredAppsAsync()) as AxiosResponse;

      if (response.data.isSuccess) {
        result.isSuccess = response.data.isSuccess;
        result.message = response.data.message;
        result.apps = Array<IApp>();
        response.data.payload.forEach((app:any) => {
          const users = Array<User>();

          app.users.forEach((user:any) => {
            users.push(new User(
              user.id,
              user.userName,
              user.firstName,
              user.lastName,
              user.nickname,
              user.fullName,
              user.email,
              user.isEmailConfirmed,
              user.receivedRequestToUpdateEmail,
              user.receivedRequestToUpdatePassword,
              user.isActive,
              user.isSuperUser,
              user.isAdmin,
              user.dateCreated,
              user.dateUpdated
            ));
          });

          result.apps.push(new App(
            app.id,
            app.name,
            app.license,
            app.ownerId,
            app.localUrl,
            app.stagingUrl,
            app.qaUrl,
            app.prodUrl,
            app.sourceCodeUrl,
            app.isActive,
            app.environment,
            app.permitSuperUserAccess,
            app.permitCollectiveLogins,
            app.disableCustomUrls,
            app.customEmailConfirmationAction,
            app.customPasswordResetAction,
            app.useCustomSMTPServer,
            app.smtpServerSettings,
            app.userCount,
            app.timeFrame,
            app.accessDuration,
            app.displayInGallery,
            app.dateCreated,
            app.dateUpdated,
            users
          ));
        });
      } else {
        result.isSuccess = response.data.isSuccess;
        StaticServiceMethods.processFailedResponse(response);
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("error: ", error);
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