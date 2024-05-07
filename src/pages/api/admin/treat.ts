import { ApiPost, ApiResponse } from "@/misc/express";
import { treatService } from "@/services/treat";
import { AddTreatmentReq } from "@/services/treat/types";

export default async function handler(
  req: ApiPost<AddTreatmentReq>,
  res: ApiResponse
) {
  if (req.method === "POST") {
    try {
      const { authorization } = req.headers;
      const result = await treatService.addTreatment({
        token: authorization,
        treatment: req.body,
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
