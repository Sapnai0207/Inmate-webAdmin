import { ApiGet, ApiResponse } from "@/misc/express";
import { customerService } from "@/services/customer";
import { getNotificationReq } from "@/services/customer/types";

export default async function handler(
  req: ApiGet<getNotificationReq>,
  res: ApiResponse
) {
  if (req.method === "GET") {
    try {
      const { registerNo } = req.query;
      const result = await customerService.getNotifications({
        registerNo: registerNo,
      });
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
