import { Customer, Diagnose, Treatment, Notification } from "../db/types";

export interface CustomerService {
  list: (req: GetCustomerList) => Promise<GetCustomerListRes>;
  getSingleCustomer: (req: {
    token?: string;
    register?: string;
  }) => Promise<GetSingleCustomer>;
  setTreatmentDate: (req: SetTreatmentDateReq) => Promise<GetSingleCustomer>;
  setDeviceToken: (req: setDeviceTokenReq) => Promise<Customer>;
  getNotifications: (req: getNotificationReq) => Promise<Notification[]>;
}

export interface SetTreatmentDateReq {
  token?: string;
  customerId: string;
  startDate: string;
  days: number;
}

export interface getNotificationReq {
  registerNo: string;
}
export interface setDeviceTokenReq {
  token?: string;
  registerNo: string;
  deviceToken: string;
}

export interface GetSingleCustomer extends Customer {
  treatments: Treatment[];
  diagnoses: Diagnose[];
}

export interface GetCustomerList {
  token?: string;
  register?: string;
  full?: boolean;
  page?: string;
  pageSize?: string;
}

export interface GetCustomerListRes {
  page: number;
  pageSize: number;
  total: number;
  list: Customer[];
}
