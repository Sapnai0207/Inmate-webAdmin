import { authService } from "../../services/auth";
import { AuthController } from "./types";

export const authController: AuthController = {
  loginEmail: async (req, res, next) => {
    try {
      const result = await authService.loginEmail(req.body);
      res.send(result);
    } catch (e: any) {
      next(e);
    }
  },
  loginPhone: async (req, res, next) => {
    try {
      const result = await authService.loginPhone(req.body);
      res.send(result);
    } catch (e: any) {
      next(e);
    }
  },
  register: async (req, res, next) => {
    try {
      const result = await authService.register(req.body);

      res.send(result);
    } catch (e: any) {
      next(e);
    }
  },
};
