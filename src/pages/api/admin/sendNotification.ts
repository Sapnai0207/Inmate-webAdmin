import { ApiPost, ApiResponse } from "@/misc/express";
import { authService } from "@/services/auth";
import admin from "firebase-admin";

export interface NotifReq {
  deviceToken: string;
  title: string;
  description: string;
  registerNo: string;
}

if (!admin.apps.length) {
  const certification = require("@/firebase.json");
  admin.initializeApp({
    credential: admin.credential.cert(certification),
  });
}

export default async function handler(
  req: ApiPost<NotifReq>,
  res: ApiResponse
) {
  if (req.method === "POST") {
    try {
      const app = admin.app();
      const { description, title, deviceToken, registerNo } = req.body;

      const newNotif = await authService.addNotification({
        description: description,
        registerNo: registerNo,
        title: title,
      });

      const response = await app.messaging().send({
        token: deviceToken,
        notification: { title: newNotif.title, body: newNotif.description },
        android: {
          notification: {
            title: newNotif.title,
            body: newNotif.description,
          },
        },
      });
      res.status(200).json(response);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
