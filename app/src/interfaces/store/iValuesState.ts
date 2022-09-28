import { IDropdownItem } from '@/interfaces/infrastructure/iDropdownItem'
import { IDifficulty } from '@/interfaces/domain/iDifficulty'
import { IGalleryApp } from '@/interfaces/domain/iGalleryApp'

export interface IValuesState {
    difficulties: Array<IDifficulty>,
    releaseEnvironments: Array<IDropdownItem>,
    sortValues: Array<IDropdownItem>,
    timeFrames: Array<IDropdownItem>,
    gallery: Array<IGalleryApp>,
    missionStatement: string,
    expirationDate: Date,
}
