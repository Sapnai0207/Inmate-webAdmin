import { ObjectId } from "mongodb";

export interface AuthService {
  register: (req: RegisterReq) => Promise<RegisterRes>;
  loginEmail: (req: LoginReq) => Promise<LoginRes>;
  loginPhone: (req: LoginPhoneReq) => Promise<LoginRes>;
  addNotification: (req: NewNotificationReq) => Promise<NewNotificationRes>;
}
export interface NewNotificationReq {
  title: string;
  description: string;
  registerNo: string;
  date: string;
  roomNumber: string;
}

export interface NewNotificationRes {
  _id: ObjectId;
  title: string;
  description: string;
  registerNo: string;
}
export interface LoginPhoneReq {
  phone: string;
  password: string;
}

export interface LoginRes {
  token: string;
}

export interface LoginReq {
  email: string;
  password: string;
}

export interface RegisterReq {
  phone: string;
  password: string;
  registerNo: string;
  firstname: string;
  lastname: string;
  age: number;
  gender: Gender;
}

export enum Gender {
  Woman = "Эмэгтэй",
  Male = "Эрэгтэй",
  Other = "Бусад",
}

export interface RegisterRes {
  _id?: ObjectId;
  phone: string;
  registerNo: string;
  firstname: string;
  lastname: string;
  age: number;
  gender: Gender;
}
