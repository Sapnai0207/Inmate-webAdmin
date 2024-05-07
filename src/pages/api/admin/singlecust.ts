import { ApiGet, ApiResponse } from "@/misc/express";
import { customerService } from "@/services/customer";

export default async function handler(
  req: ApiGet<{ register?: string }>,
  res: ApiResponse
) {
  if (req.method === "GET") {
    try {
      const { authorization } = req.headers;
      const { register } = req.query;
      const result = await customerService.getSingleCustomer({
        register: register + "",
        token: authorization ?? "",
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
