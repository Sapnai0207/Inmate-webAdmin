import { ObjectId } from "mongodb";

export interface Diagnose {
  _id?: ObjectId;
  customerId: string;
  diseaseDescription?: string;
  diseaseCause?: string;
  medicalTreatments?: string;
  physicalTreatments?: string;
  diagnosedDate: Date;
  completelyRecovered?: boolean;
}

export interface Notification {
  _id?: ObjectId;
  registerNo: string;
  title: string;
  description: string;
  date: string;
  roomNumber: string;
}

export interface User {
  _id?: ObjectId;
  email?: string;
  phone?: string;
  password: string;
  firstname: string;
  lastname: string;
  role: string;
}

export interface Customer {
  registerNo: string;
  phone: string;
  firstname: string;
  lastname: string;
  age: number;
  gender: Gender;
  days?: number;
  startOfPatient?: Date;
  treatments?: Treatment[];
  diagnose?: Diagnose[];
  deviceToken?: string;
}

export interface Treatment {
  _id?: ObjectId;
  customerId: string;
  registerNo: string;
  states: TreatmentStates;
  information: string;
  startDate: Date;
  endDate: Date;
  roomNumber: number;
  title: string;
}

export enum Gender {
  Woman = "Эмэгтэй",
  Male = "Эрэгтэй",
  Other = "Бусад",
}

export enum TreatmentStates {
  Done = "Дууссан",
  Cancel = "Цуцлагдасан",
  Pending = "Хүлээгдэж байгаа",
}
