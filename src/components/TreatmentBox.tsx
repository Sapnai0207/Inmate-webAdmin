import React from "react";
import { Treatment } from "@/services/db/types";

export default function TreatmentBox(item: Treatment) {
  const date = item.startDate.toString().substring(0, 10);
  const startHour = item.startDate.toString().substring(11, 19);
  return (
    <div className="flex flex-col bg-green-400 h-max p-2 rounded-lg">
      <div className="font-bold text-[12px] text-center text-black">
        {item.title}
      </div>
      <div className="font-bold text-black">ЭӨ: {date + ""}</div>
      <div className="font-bold text-black">Өрөө:{item.roomNumber}</div>
      <div className="font-medium text-amber-50">
        Эхлэх цаг:{startHour + ""}
      </div>
    </div>
  );
}
