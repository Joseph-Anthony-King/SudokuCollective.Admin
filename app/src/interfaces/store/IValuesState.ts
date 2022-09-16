import { IDropdownItem } from '@/interfaces/infrastructure/IDropdownItem'
import { IDifficulty } from '@/interfaces/domain/IDifficulty'
import { IGalleryApp } from '@/interfaces/domain/IGalleryApp'

export interface IValuesState {
    difficulties: Array<IDifficulty>,
    releaseEnvironments: Array<IDropdownItem>,
    sortValues: Array<IDropdownItem>,
    timeFrames: Array<IDropdownItem>,
    gallery: Array<IGalleryApp>,
    missionStatement: string,
    expirationDate: Date,
}
