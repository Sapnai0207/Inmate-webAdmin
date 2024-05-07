import { CustomerListReq } from "@/controllers/customer/types";
import { ApiGet, ApiResponse } from "@/misc/express";
import { customerService } from "@/services/customer";

export default async function handler(
  req: ApiGet<CustomerListReq>,
  res: ApiResponse
) {
  if (req.method === "GET") {
    try {
      const { authorization } = req.headers;
      const { full } = req.query;
      console.log(full, authorization);
      const result = await customerService.list({
        full: full === "true",
        token: authorization,
      });
      res.status(200).json(result);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: (err as Error).message });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
