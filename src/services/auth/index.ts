import { ApiErrorCode, ApiException, HttpStatus } from "../../misc/express";
import { isNil } from "../../misc/utils";
import {
  CustomerCollection,
  NotificationCollection,
  UserCollection,
} from "../db/databases";
import { MongoDatabase } from "../db/dbConfig";
import { AuthService } from "./types";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY ?? "";

export const authService: AuthService = {
  addNotification: async (req) => {
    const conn = await MongoDatabase();
    const { description, registerNo, title } = req;

    if (isNil(registerNo)) {
      throw new ApiException(
        HttpStatus.BAD_REQUEST,
        ApiErrorCode.BAD_REQUEST,
        "register required"
      );
    }
    const { insertedId } = await NotificationCollection(conn).insertOne({
      description: description,
      registerNo: registerNo,
      title: title,
    });
    return {
      _id: insertedId,
      description: description,
      registerNo: registerNo,
      title: title,
    };
  },
  register: async (req) => {
    const conn = await MongoDatabase();

    const { age, firstname, gender, lastname, password, phone, registerNo } =
      req;

    const check = await CustomerCollection(conn).findOne({
      $or: [{ registerNo }, { phone }],
    });

    if (!isNil(check)) {
      throw new ApiException(
        HttpStatus.BAD_REQUEST,
        ApiErrorCode.BAD_REQUEST,
        "user exists"
      );
    }
    const { insertedId } = await UserCollection(conn).insertOne({
      firstname,
      lastname,
      password,
      phone,
      role: "CUSTOMER",
    });
    await CustomerCollection(conn).insertOne({
      phone,
      registerNo,
      firstname,
      lastname,
      age,
      gender,
    });

    return {
      _id: insertedId,
      age,
      firstname,
      gender,
      lastname,
      phone,
      registerNo,
    };
  },
  loginEmail: async (req) => {
    const { password, email } = req;

    const conn = await MongoDatabase();
    const user = await UserCollection(conn).findOne({ email });
    if (isNil(user) || user.password !== password) {
      throw new ApiException(
        HttpStatus.BAD_REQUEST,
        ApiErrorCode.BAD_REQUEST,
        "Invalid email or password"
      );
    }
    const { password: _pass, ...rest } = user;

    const token = jwt.sign(rest, SECRET_KEY, { expiresIn: "30 days" });

    return { token };
  },
  loginPhone: async (req) => {
    const { password, phone } = req;
    const conn = await MongoDatabase();
    const user = await UserCollection(conn).findOne({ phone });
    const customer = await CustomerCollection(conn).findOne({ phone });
    if (isNil(user) || user.password !== password || isNil(customer)) {
      throw new ApiException(
        HttpStatus.BAD_REQUEST,
        ApiErrorCode.BAD_REQUEST,
        `Invalid email or password`
      );
    }

    const { startOfPatient, days, ...rest } = customer;

    const token = jwt.sign(rest, SECRET_KEY, { expiresIn: "30 days" });

    return { token, customer };
  },
};
