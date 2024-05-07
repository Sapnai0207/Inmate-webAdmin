import { ApiNextFunction, ApiPost, ApiResponse } from '../../misc/express'

export interface AuthController {
  register: (req: ApiPost<RegisterReq>, res: ApiResponse, next: ApiNextFunction) => any
  loginEmail: (req: ApiPost<LoginReq>, res: ApiResponse, next: ApiNextFunction) => any
  loginPhone: (req: ApiPost<LoginPhoneReq>, res: ApiResponse, next: ApiNextFunction) => any
}

export interface LoginPhoneReq {
  phone: string
  password: string
}

export interface LoginReq {
  email: string
  password: string
}

export interface RegisterReq {
  phone: string
  password: string
  registerNo: string
  firstname: string
  lastname: string
  age: number
  gender: Gender
}

export enum Gender {
  Woman = 'Эмэгтэй',
  Male = 'Эрэгтэй',
  Other = 'Бусад',
}
