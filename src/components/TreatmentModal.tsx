import React, { Dispatch, useMemo, useState } from "react";
import { Button, Modal, message } from "antd";
import { Inpatient } from "@/utils/customData";
import TreatmentCard from "./TreatmentCard";
import axios from "axios";
import { Customer } from "@/services/db/types";
import dayjs from "dayjs";

interface TreatmentModalProps {
  show: boolean;
  setShow: Dispatch<boolean>;
  treatment: Customer;
  registerNo: string;
}

function getDates(startDate: Date, endDate: Date) {
  const dates: Date[] = [];
  const currentDate = new Date(startDate);
  const end = new Date(endDate);

  while (currentDate <= end) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

export default function TreatmentModal({
  setShow,
  show,
  treatment,
  registerNo,
}: TreatmentModalProps) {
  // const endDate = new Date(treatment.startOfPatient);
  // endDate.setDate(treatment.startOfPatient.getDate() + treatment.days);

  const data = useMemo(() => {
    if (!treatment || !treatment.startOfPatient || !treatment.days) {
      return [];
    }
    const startDate = new Date(treatment.startOfPatient);

    const endDate = new Date(startDate.getTime());

    endDate.setDate(startDate.getDate() + (treatment.days - 1));
    return getDates(startDate, endDate).map((date) => {
      const newDate = dayjs(date).format("YYYY/MM/DD");
      return newDate;
    });
  }, [treatment]);
  return (
    <Modal
      open={show}
      width="60%"
      className="flex flex-col"
      onCancel={() => setShow(false)}
      footer={[
        <Button key="save" type="primary" onClick={() => {}}>
          Хадгалах
        </Button>,
      ]}
    >
      <div className="font-bold text-2xl text-center mb-4">
        Хэвтэн эмчлүүлж буй өдрүүд
      </div>
      <div className="flex flex-wrap gap-4 justify-around">
        {data.map((item, index) => (
          <TreatmentCard
            key={index}
            date={item}
            treatment={treatment}
            registerNo={registerNo}
          />
        ))}
      </div>
    </Modal>
  );
}
