import express from "express";
import { authController } from "../controllers/auth";
import { customerController } from "../controllers/customer";
import { treatmentController } from "../controllers/treat";
import { expressErrorHandler, expressNotFoundHandler } from "../misc/express";

const api = express.Router();
api.use(express.json());
api
  .use(
    "/",
    express.Router().get("/", (req, res, next) => res.send("inmate api 1.0v"))
  )
  .use(
    "/user",
    express
      .Router()
      .post("/login", (req, res, next) =>
        authController.loginEmail(req, res, next)
      )
  )
  .use(
    "/customer",
    express
      .Router()
      .post("/login", (req, res, next) =>
        authController.loginPhone(req, res, next)
      )
      .post("/register", (req, res, next) =>
        authController.register(req, res, next)
      )
  )
  .use(
    "/admin",
    express
      .Router()
      .get("/custlist", (req, res, next) =>
        customerController.list(req, res, next)
      )
      .get("/singlecust", (req, res, next) =>
        customerController.getSingle(req, res, next)
      )
      .post("/setdate", (req, res, next) =>
        customerController.setTreatmentDate(req, res, next)
      )
  )
  .use(
    "/admin",
    express
      .Router()
      .get("/alltreat", (req, res, next) =>
        treatmentController.getAllTreatment(req, res, next)
      )
      .post("/treatstates", (req, res, next) =>
        treatmentController.changeStates(req, res, next)
      )
      .post("/treat", (req, res, next) =>
        treatmentController.addTreatment(req, res, next)
      )
      .post("/deletetreat", (req, res, next) =>
        treatmentController.deleteTreatment(req, res, next)
      )
      .post("/diagnose", (req, res, next) =>
        treatmentController.addDiagnose(req, res, next)
      )
      .post("/deletediagnose", (req, res, next) =>
        treatmentController.deleteDiagnose(req, res, next)
      )
  )
  .use(expressErrorHandler as any)
  .use(expressNotFoundHandler as any);

export default api;
