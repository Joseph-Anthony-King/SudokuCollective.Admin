import { IDropdownItem } from '@/interfaces/infrastructure/iDropdownItem'
import { IDifficulty } from '@/interfaces/domain/iDifficulty'
import { IGalleryApp } from '@/interfaces/domain/iGalleryApp'

export interface IValuesState {
    difficulties: Array<IDifficulty> | null,
    releaseEnvironments: Array<IDropdownItem> | null,
    sortValues: Array<IDropdownItem> | null,
    timeFrames: Array<IDropdownItem> | null,
    gameStates: Array<IDropdownItem> | null,
    gallery: Array<IGalleryApp> | null,
    missionStatement: string | null,
    expirationDate: Date | null,
}
