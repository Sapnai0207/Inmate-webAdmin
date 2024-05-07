import { AddDiagnoseReq } from "@/controllers/treat/types";
import { ApiPost, ApiResponse } from "@/misc/express";
import { treatService } from "@/services/treat";

export default async function handler(
  req: ApiPost<AddDiagnoseReq>,
  res: ApiResponse
) {
  if (req.method === "POST") {
    try {
      const { authorization } = req.headers;
      const result = await treatService.addDiagnose({
        token: authorization,
        diagnose: req.body,
      });
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
