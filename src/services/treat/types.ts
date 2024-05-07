import { Customer, Diagnose, Treatment, TreatmentStates } from '../db/types'

export interface TreatmentService {
  getAllTreatment: (req: GetAllTreatmentReq) => Promise<GetAllTreatmentRes>
  changeTreatmentStates: (req: SetTreatmentStatusReq) => Promise<{ success: boolean }>
  addTreatment: (req: { token?: string, treatment: AddTreatmentReq }) => Promise<GetSingleCustomer>
  deleteTreatment: (req: { token?: string, _id: string }) => Promise<{ success: boolean }>
  addDiagnose: (req: { token?: string, diagnose: Diagnose }) => Promise<GetSingleCustomer>
  deleteDiagnose: (req: { token?: string, _id: string }) => Promise<{ success: boolean }>
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

export interface SetTreatmentStatusReq {
  token?: string
  _id: string
  states: TreatmentStates
}

export interface GetAllTreatmentRes {
  page: number
  pageSize: number
  total: number
  list: Treatment[]
}

export interface GetAllTreatmentReq {
  token?: string
  page?: string
  pageSize?: string
  register?: string
  states?: TreatmentStates
  room?: string
  startDate?: string
}

export interface GetSingleCustomer extends Customer {
  treatments: Treatment[]
  diagnoses: Diagnose[]
}
