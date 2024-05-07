import { ApiGet, ApiNextFunction, ApiPost, ApiResponse } from '../../misc/express'
import { TreatmentStates } from '../../services/db/types'
import { GetAllTreatmentReq } from '../../services/treat/types'

export interface TreatmentController {
  changeStates: (req: ApiPost<ChangeTreatmentStateReq>, res: ApiResponse, next: ApiNextFunction) => any
  getAllTreatment: (req: ApiGet<GetAllTreatmentReq>, res: ApiResponse, next: ApiNextFunction) => any
  addTreatment: (req: ApiPost<AddTreatmentReq>, res: ApiResponse, next: ApiNextFunction) => any
  deleteTreatment: (req: ApiPost<{ _id: string }>, res: ApiResponse, next: ApiNextFunction) => any
  addDiagnose: (req: ApiPost<AddDiagnoseReq>, res: ApiResponse, next: ApiNextFunction) => any
  deleteDiagnose: (req: ApiPost<{ _id: string }>, res: ApiResponse, next: ApiNextFunction) => any
}

export interface ChangeTreatmentStateReq {
  _id: string
  states: TreatmentStates
}

export interface AddDiagnoseReq {
  customerId: string
  diseaseDescription: string
  diseaseCause?: string
  medicalTreatments?: string
  physicalTreatments?: string
  diagnosedDate: Date
  completelyRecovered?: boolean
}

export interface AddTreatmentReq {
  customerId: string
  states: TreatmentStates
  information: string
  startDate: Date
  endDate: Date
  roomNumber: number
  title: string
}
