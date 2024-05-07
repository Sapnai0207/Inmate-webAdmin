import { getLogger } from "log4js";
import { Filter, ObjectId } from "mongodb";
import { authValidate } from "../../misc/auth";
import { ApiErrorCode, ApiException, HttpStatus } from "../../misc/express";
import { isNil } from "../../misc/utils";
import {
  CustomerCollection,
  DiagnoseCollection,
  NotificationCollection,
  TreatmentCollection,
} from "../db/databases";
import { MongoDatabase } from "../db/dbConfig";
import { Customer } from "../db/types";
import { CustomerService } from "./types";
import dayjs from "dayjs";

const logger = getLogger("CustomerService");

export const customerService: CustomerService = {
  list: async (req) => {
    try {
      const { register, token, full } = req;
      if (isNil(token)) {
        throw new ApiException(
          HttpStatus.UNAUTHORIZED,
          ApiErrorCode.UNAUTHORIZED,
          "login required"
        );
      }
      const parsedToken = authValidate(token);

      const { role } = parsedToken ?? {};

      if (role !== "DOCTOR" && role !== "NURSE") {
        throw new ApiException(
          HttpStatus.FORBIDDEN,
          ApiErrorCode.FORBIDDEN,
          "permission denied"
        );
      }

      const page = parseInt(req.page ?? "0");
      const pageSize = parseInt(req.pageSize ?? "10");

      const filterQuery: Filter<Customer> = {};

      // if (!isNil(register)) {
      //   filterQuery.registerNo = { $regex: register };
      // }
      if (full === true) {
        filterQuery.days = { $exists: true };
        filterQuery.startOfPatient = { $exists: true };
      } else {
        filterQuery.days = { $exists: false };
        filterQuery.startOfPatient = { $exists: true };
      }

      const conn = await MongoDatabase();
      const list = await CustomerCollection(conn).find(filterQuery).toArray();

      const total = await CustomerCollection(conn).countDocuments(filterQuery);

      return {
        list,
        page,
        pageSize,
        total,
      };
    } catch (e: any) {
      logger.error("customerService list failed", e);
      throw new ApiException(e?.status, e.code, e.messge);
    }
  },
  getNotifications: async (req) => {
    try {
      const { registerNo } = req;
      const conn = await MongoDatabase();
      const list = await NotificationCollection(conn)
        .find({ registerNo: registerNo })
        .toArray();
      console.log(list);
      return list;
    } catch (e: any) {
      logger.error("getNotification list failed", e);
      throw new ApiException(e?.status, e.code, e.messge);
    }
  },

  setTreatmentDate: async (req) => {
    try {
      const { customerId, days, startDate, token } = req;
      if (isNil(token)) {
        throw new ApiException(
          HttpStatus.UNAUTHORIZED,
          ApiErrorCode.UNAUTHORIZED,
          "login required"
        );
      }

      const parsedToken = authValidate(token);
      const { role } = parsedToken ?? {};

      if (role !== "DOCTOR" && role !== "NURSE") {
        throw new ApiException(
          HttpStatus.FORBIDDEN,
          ApiErrorCode.FORBIDDEN,
          "permission denied"
        );
      }

      const conn = await MongoDatabase();
      const { value: cust } = await CustomerCollection(conn).findOneAndUpdate(
        { _id: new ObjectId(customerId) },
        {
          $set: {
            days,
            startOfPatient: dayjs(startDate).toDate(),
          },
        },
        { returnDocument: "after" }
      );

      if (isNil(cust)) {
        throw new ApiException(
          HttpStatus.NOT_FOUND,
          ApiErrorCode.BAD_REQUEST,
          "customer not found"
        );
      }

      const treatments = await TreatmentCollection(conn)
        .find({ customerId: cust._id.toHexString() })
        .toArray();
      const diagnoses = await DiagnoseCollection(conn)
        .find({ customerId: cust._id.toHexString() })
        .toArray();

      return {
        ...cust,
        treatments,
        diagnoses,
      };
    } catch (e: any) {
      logger.error("customerService list failed", e);
      throw new ApiException(e?.status, e.code, e.messge);
    }
  },
  getSingleCustomer: async (req) => {
    try {
      const { register, token } = req;
      console.log(req, "hello");
      if (isNil(token)) {
        throw new ApiException(
          HttpStatus.UNAUTHORIZED,
          ApiErrorCode.UNAUTHORIZED,
          "login required"
        );
      }
      if (isNil(register)) {
        throw new ApiException(
          HttpStatus.BAD_REQUEST,
          ApiErrorCode.BAD_REQUEST,
          "register required"
        );
      }

      const parsedToken = authValidate(token);

      const { role } = parsedToken ?? {};

      // if (role !== "DOCTOR" && role !== "NURSE") {
      //   throw new ApiException(
      //     HttpStatus.FORBIDDEN,
      //     ApiErrorCode.FORBIDDEN,
      //     "permission denied"
      //   );
      // }
      const conn = await MongoDatabase();
      const cust = await CustomerCollection(conn).findOne({
        registerNo: register,
      });

      if (isNil(cust)) {
        throw new ApiException(
          HttpStatus.NOT_FOUND,
          ApiErrorCode.BAD_REQUEST,
          "customer not found"
        );
      }

      const treatments = await TreatmentCollection(conn)
        .find({ customerId: cust._id.toHexString() })
        .toArray();
      const diagnoses = await DiagnoseCollection(conn)
        .find({ customerId: cust._id.toHexString() })
        .toArray();

      return {
        ...cust,
        treatments,
        diagnoses,
      };
    } catch (e: any) {
      logger.error("customerService list failed", e);
      throw new ApiException(e?.status, e.code, e.messge);
    }
  },
  setDeviceToken: async (req) => {
    try {
      const { deviceToken, registerNo, token } = req;

      if (isNil(token)) {
        throw new ApiException(
          HttpStatus.UNAUTHORIZED,
          ApiErrorCode.UNAUTHORIZED,
          "login required"
        );
      }

      if (isNil(registerNo)) {
        throw new ApiException(
          HttpStatus.BAD_REQUEST,
          ApiErrorCode.BAD_REQUEST,
          "register required"
        );
      }

      const conn = await MongoDatabase();
      await CustomerCollection(conn).findOneAndUpdate(
        { registerNo: registerNo },
        { $set: { deviceToken: deviceToken } }
      );

      const updatedCustomer = await CustomerCollection(conn).findOne({
        registerNo: registerNo,
      });

      if (isNil(updatedCustomer)) {
        throw new ApiException(
          HttpStatus.NOT_FOUND,
          ApiErrorCode.BAD_REQUEST,
          "customer not found"
        );
      }
      return updatedCustomer;
    } catch (error: any) {
      logger.error("setDevice token", error);
      throw new ApiException(error?.status, error.code, error.message);
    }
  },
};
