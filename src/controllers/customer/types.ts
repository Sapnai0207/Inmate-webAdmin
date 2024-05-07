import { ApiGet, ApiNextFunction, ApiPost, ApiResponse } from '../../misc/express'

export interface CustomerController {
  list: (req: ApiGet<CustomerListReq>, res: ApiResponse, next: ApiNextFunction) => any
  getSingle: (req: ApiGet<{ register?: string }>, res: ApiResponse, next: ApiNextFunction) => any
  setTreatmentDate: (req: ApiPost<SetTreatmentDateReq>, res: ApiResponse, next: ApiNextFunction) => any
}

export interface SetTreatmentDateReq {
  customerId: string
  startDate: string
  days: number
}

export interface CustomerListReq {
  page?: string
  pageSize?: string
  register?: string
  full?: string
}
