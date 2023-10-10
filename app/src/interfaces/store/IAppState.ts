import { IUser } from "@/interfaces/domain/iUser";

export interface IAppState {
    license: string,
    tokenExpirationDate: Date,
    processingMessage: string,
    user: IUser | null,
    token: string,
    confirmedUserName: string,
    serviceMessage: string,
}
