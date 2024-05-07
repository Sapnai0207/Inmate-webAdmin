import { ApiGet, ApiResponse } from "@/misc/express";
import { treatService } from "@/services/treat";
import { GetAllTreatmentReq } from "@/services/treat/types";

export default async function handler(
  req: ApiGet<GetAllTreatmentReq>,
  res: ApiResponse
) {
  if (req.method === "GET") {
    try {
      const { authorization } = req.headers;
      const result = await treatService.getAllTreatment({
        token: authorization,
        ...req.query,
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
