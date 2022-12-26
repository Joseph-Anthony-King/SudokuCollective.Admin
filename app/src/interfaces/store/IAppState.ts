import { User } from "@/models/domain/user";

export interface IAppState {
    license: string,
    expirationDate: Date,
    processingMessage: string,
    user: User,
    token: string,
}
