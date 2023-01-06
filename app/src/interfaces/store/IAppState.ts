import { IUser } from "@/interfaces/domain/iUser";

export interface IAppState {
    license: string,
    expirationDate: Date,
    processingMessage: string,
    user: IUser | null,
    token: string,
    confirmedUserName: string,
}
