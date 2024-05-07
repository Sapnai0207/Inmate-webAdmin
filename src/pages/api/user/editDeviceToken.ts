import { ApiPost, ApiResponse } from "@/misc/express";
import { customerService } from "@/services/customer";
import { setDeviceTokenReq } from "@/services/customer/types";

export default async function handler(
  req: ApiPost<setDeviceTokenReq>,
  res: ApiResponse
) {
  if (req.method === "POST") {
    try {
      const { authorization } = req.headers;
      console.log(authorization);
      const result = await customerService.setDeviceToken(req.body);
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
