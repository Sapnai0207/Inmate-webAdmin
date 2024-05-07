import { customerService } from "../../services/customer";
import { CustomerController } from "./types";

export const customerController: CustomerController = {
  list: async (req, res, next) => {
    try {
      const { authorization } = req.headers;
      const { full, page, pageSize, register } = req.query;
      const result = await customerService.list({
        token: authorization,
        full: full === "true",
        page,
        pageSize,
        register,
      });

      res.send(result);
    } catch (e: any) {
      next(e);
    }
  },
  getSingle: async (req, res, next) => {
    try {
      const { authorization } = req.headers;
      const { register } = req.query;
      const result = await customerService.getSingleCustomer({
        register,
        token: authorization,
      });

      res.send(result);
    } catch (e: any) {
      next(e);
    }
  },
  setTreatmentDate: async (req, res, next) => {
    try {
      const { authorization } = req.headers;
      const result = await customerService.setTreatmentDate({
        token: authorization,
        ...req.body,
      });
      res.send(result);
    } catch (e: any) {
      next(e);
    }
  },
};
