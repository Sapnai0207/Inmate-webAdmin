import { ApiPost, ApiResponse } from "@/misc/express";
import { authService } from "@/services/auth";
import admin from "firebase-admin";

export interface NotifReq {
  deviceToken: string;
  title: string;
  description: string;
  registerNo: string;
  date: string;
  roomNumber: string;
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
      const { description, title, deviceToken, registerNo, date, roomNumber } =
        req.body;

      const newNotif = await authService.addNotification({
        description: description,
        registerNo: registerNo,
        title: title,
        date: date,
        roomNumber: roomNumber,
      });

      const response = await app.messaging().send({
        token: deviceToken,
        notification: {
          title: "Шинэ эмчилгээ нэмэгдлээ",
          body: newNotif.title,
        },
        android: {
          notification: {
            title: "Шинэ эмчилгээ нэмэгдлээ",
            body: newNotif.title,
          },
        },
      });
      res.status(200).json(response);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
