import { ApiPost, ApiResponse } from "@/misc/express";
import { customerService } from "@/services/customer";
import { SetTreatmentDateReq } from "@/services/customer/types";

export default async function handler(
  req: ApiPost<SetTreatmentDateReq>,
  res: ApiResponse
) {
  if (req.method === "POST") {
    try {
      const { authorization } = req.headers;
      const result = await customerService.setTreatmentDate({
        token: authorization,
        ...req.body,
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
