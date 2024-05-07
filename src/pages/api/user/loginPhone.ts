import { ApiPost, ApiResponse } from "@/misc/express";
import { authService } from "@/services/auth";
import { LoginPhoneReq } from "@/services/auth/types";

export default async function handler(
  req: ApiPost<LoginPhoneReq>,
  res: ApiResponse
) {
  if (req.method === "POST") {
    try {
      const result = await authService.loginPhone(req.body);
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
