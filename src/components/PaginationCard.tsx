import React, { useState } from "react";

import { SearchTreatment } from "./NursePage";
import CardModal from "./CardModal";
import { Treatment } from "@/services/db/types";
import dayjs from "dayjs";

type PaginationCardProps = {
  refetch: () => void;
  treatment: Treatment;
};

export default function PaginationCard({
  refetch,
  treatment,
}: PaginationCardProps) {
  const [show, setShow] = useState(false);
  const date = treatment.startDate.toString().substring(0, 10);
  return (
    <div className="h-1/3 w-1/3 bg-orange-200 rounded-2xl p-4 flex flex-col">
      <CardModal
        show={show}
        setShow={setShow}
        _id={treatment._id?.toString() ?? ""}
        refetch={refetch}
      />
      <div className="text-center font-bold text-black text-[16px]">
        {treatment.title}
      </div>
      <div className="text-white font-bold flex-grow">
        Хэрэглэгчийн Регистр: {treatment.registerNo}
      </div>
      <div className="text-white font-bold flex-grow">
        Эмчилгээны өрөө: {treatment.roomNumber}
      </div>
      <div className="text-white font-bold flex-grow">
        Төлөв: {treatment.states}
      </div>
      <div className="text-white font-bold flex-grow">
        Эмчилгээны өдөр: {date}
      </div>
      <div className="text-white font-bold flex-grow overflow-hidden truncate">
        Эмчлүүлэгчийн нэр: {treatment.information}
      </div>
      <button
        className="h-9 w-[80%] bg-orange-600 rounded-xl my-2 self-center"
        onClick={(event) => {
          event.preventDefault();
          setShow(true);
        }}
      >
        Төлөв шинэчлэх
      </button>
    </div>
  );
}
