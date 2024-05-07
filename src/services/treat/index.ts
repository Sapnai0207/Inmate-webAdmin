import dayjs from "dayjs";
import { getLogger } from "log4js";
import { Filter, ObjectId } from "mongodb";
import { authValidate } from "../../misc/auth";
import { ApiErrorCode, ApiException, HttpStatus } from "../../misc/express";
import { isNil } from "../../misc/utils";
import {
  CustomerCollection,
  DiagnoseCollection,
  TreatmentCollection,
} from "../db/databases";
import { MongoDatabase } from "../db/dbConfig";
import { TreatmentService } from "./types";
import { Treatment } from "../db/types";

const logger = getLogger("TreatmentService");

export const treatService: TreatmentService = {
  getAllTreatment: async (req) => {
    try {
      const { token, register, room, startDate, states } = req;
      if (isNil(token)) {
        throw new ApiException(
          HttpStatus.UNAUTHORIZED,
          ApiErrorCode.UNAUTHORIZED,
          "login required"
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

      const page = parseInt(req.page ?? "0");
      const pageSize = parseInt(req.pageSize ?? "10");

      const filter: Filter<Treatment> = {};

      if (!isNil(register)) {
        filter.registerNo = { $regex: register };
      }
      if (!isNil(states)) {
        filter.states = states;
      }
      if (!isNil(room)) {
        filter.roomNumber = parseInt(room);
      }
      if (!isNil(startDate)) {
        filter.startDate = { $gt: dayjs(startDate).toDate() };
      }

      const list = await TreatmentCollection(conn).find(filter).toArray();
      const total = await TreatmentCollection(conn).countDocuments(filter);

      return {
        list,
        page,
        pageSize,
        total,
      };
    } catch (e: any) {
      logger.error("TreatmentService list failed", e);
      throw new ApiException(e?.status, e.code, e.messge);
    }
  },
  changeTreatmentStates: async (req) => {
    try {
      const { token, _id, states } = req;

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

      const { value } = await TreatmentCollection(conn).findOneAndUpdate(
        { _id: new ObjectId(_id) },
        { $set: { states } }
      );

      if (isNil(value)) {
        throw new ApiException(
          HttpStatus.INTERNAL_ERROR,
          ApiErrorCode.INTERNAL_ERROR,
          "cannot update treatment"
        );
      }

      return {
        success: true,
      };
    } catch (e: any) {
      logger.error("TreatmentService list failed", e);
      throw new ApiException(e?.status, e.code, e.messge);
    }
  },
  addTreatment: async (req) => {
    try {
      const { treatment, token } = req;

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

      const { customerId, startDate, endDate } = treatment;
      console.log(customerId, startDate, endDate, "haha");
      const conn = await MongoDatabase();
      const cust = await CustomerCollection(conn).findOne({
        _id: new ObjectId(customerId),
      });

      if (isNil(cust)) {
        throw new ApiException(
          HttpStatus.NOT_FOUND,
          ApiErrorCode.BAD_REQUEST,
          "customer not found"
        );
      }

      const check = await TreatmentCollection(conn).findOne({
        $or: [
          {
            startDate: { $lt: dayjs(startDate).toDate() },
            endDate: { $gt: dayjs(startDate).toDate() },
          },
          {
            startDate: { $lt: dayjs(endDate).toDate() },
            endDate: { $gt: dayjs(endDate).toDate() },
          },
        ],
      });

      if (!isNil(check)) {
        throw new ApiException(
          HttpStatus.CONFLICT,
          ApiErrorCode.CONFLICT,
          "Treatment conflicted"
        );
      }

      await TreatmentCollection(conn).insertOne({
        ...treatment,
        registerNo: cust.registerNo,
        startDate: startDate,
        endDate: endDate,
      });

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
      logger.error("TreatmentService list failed", e);
      throw new ApiException(e?.status, e.code, e.messge);
    }
  },
  deleteTreatment: async (req) => {
    try {
      const { _id, token } = req;

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

      await TreatmentCollection(conn).deleteOne({
        _id: new ObjectId(_id),
      });

      return {
        success: true,
      };
    } catch (e: any) {
      logger.error("TreatmentService list failed", e);
      throw new ApiException(e?.status, e.code, e.messge);
    }
  },
  addDiagnose: async (req) => {
    try {
      const { diagnose, token } = req;

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

      const { customerId } = diagnose;
      const conn = await MongoDatabase();

      await DiagnoseCollection(conn).insertOne(diagnose);

      const cust = await CustomerCollection(conn).findOne({
        _id: new ObjectId(customerId),
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
      logger.error("TreatmentService list failed", e);
      throw new ApiException(e?.status, e.code, e.messge);
    }
  },
  deleteDiagnose: async (req) => {
    try {
      const { _id, token } = req;
      console.log(req, "sda");
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

      await DiagnoseCollection(conn).deleteOne({
        _id: new ObjectId(_id),
      });

      return {
        success: true,
      };
    } catch (e: any) {
      logger.error("TreatmentService list failed", e);
      throw new ApiException(e?.status, e.code, e.messge);
    }
  },
};
