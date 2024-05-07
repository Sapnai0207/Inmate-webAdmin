import { Inpatient } from "../utils/customData";
import React, { useState } from "react";
import TreatmentModal from "./TreatmentModal";
import PrimaryButton from "./PrimaryButton";
import dayjs from "dayjs";
import { Customer } from "@/services/db/types";

export default function TreatmentsProfile({
  treatment,
}: {
  treatment: Customer;
}) {
  // const date = treatment.startOfPatient.toISOString().split("T")[0];
  const date = dayjs(treatment.startOfPatient).format("YYYY-MM-DD");
  const [show, setShow] = useState(false);
  return (
    <div className="h-[400px] w-[300px] rounded-2xl bg-white flex flex-col overflow-hidden">
      <TreatmentModal
        show={show}
        setShow={setShow}
        treatment={treatment}
        registerNo={treatment.registerNo}
      />
      <div className="w-full h-1/4 bg-orange-200" />
      <div className="w-full h-full flex flex-col p-4">
        <div className="flex gap-2 self-center mb-4">
          <div className="text-orange-200 text-2xl">{treatment.lastname}</div>
          <div className="text-black text-2xl">{treatment.firstname}</div>
        </div>
        <div className="flex gap-4 grow">
          <div className="text-black font-bold text-lg">Регистр:</div>
          <div className="text-black font-bold text-lg">
            {treatment.registerNo}
          </div>
        </div>
        <div className="flex gap-4 grow">
          <div className="text-black font-bold text-lg">Нас:</div>
          <div className="text-black font-bold text-lg">{treatment.age}</div>
        </div>
        <div className="flex gap-4 grow">
          <div className="text-black font-bold text-lg">Хүйс:</div>
          <div className="text-black font-bold text-lg">{treatment.gender}</div>
        </div>
        <div className="flex gap-4 grow">
          <div className="text-black font-bold text-lg">Эмчлүүлэх хугацаа:</div>
          <div className="text-black font-bold text-lg">{treatment.days}</div>
        </div>
        <div className="flex gap-4 grow">
          <div className="text-black font-bold text-lg">ЭЭӨ:</div>
          <div className="text-black font-bold text-lg">{date}</div>
        </div>
        <PrimaryButton title="Эмчилгээ бүртгэх" onClick={() => setShow(true)} />
      </div>
    </div>
  );
}
