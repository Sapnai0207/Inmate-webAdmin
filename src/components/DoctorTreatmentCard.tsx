import React from "react";
import { Treatment } from "@/utils/customData";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/free-mode";

type DoctorTreatmentCardProps = {
  treatment: Treatment;
};

export default function DoctorTreatmentCard({
  treatment,
}: DoctorTreatmentCardProps) {
  return (
    <div className="flex flex-col rounded-xl h-full w-full bg-white p-8 overflow-hidden cursor-pointe">
      <div className="font-bold text-black text-center text-[16px] mb-4 flex">
        {treatment.title}
      </div>
      <div className="font-medium text-blue-400 text-center">
        {treatment.information}
      </div>
    </div>
  );
}
