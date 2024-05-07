import { Inpatient } from "@/utils/customData";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import AddTreatmentModal from "./AddTreatmentModal";
import TreatmentBox from "./TreatmentBox";
import axios from "axios";
import { message } from "antd";
import { Customer, Treatment } from "@/services/db/types";
import dayjs from "dayjs";

type TreatmentCardProps = {
  date: string;
  treatment: Customer;
  registerNo: string;
};

export default function TreatmentCard({
  date,
  treatment,
  registerNo,
}: TreatmentCardProps) {
  const [show, setShow] = useState(false);
  const [custId, setCustId] = useState("");
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const addTreatment = () => {
    setShow(true);
  };
  const getProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "/api/admin/singlecust?register=" + registerNo,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCustId(response.data._id);
      setTreatments(response.data.treatments);
      console.log("add trtment cust id:", response.data._id);
    } catch (error) {
      message.error("Алдаа гарлаа! Дахин оролдоно уу.", 2);
    }
  }, [registerNo]);

  const data = useMemo(() => {
    if (treatments) {
      return treatments.filter((item) => {
        const dates = date.substring(0, 10);
        const secondDates = dayjs(
          item.startDate.toString().substring(0, 10)
        ).format("YYYY/MM/DD");
        console.log(dates, secondDates);
        return dates === secondDates;
      });
      // const dates = new Date(treatment.startOfPatient ?? "")
      //   .toISOString()
      //   .split("T")[0];
      // return treatments.filter(
      //   (item) => item.registerNo === treatment.registerNo && dates === date
      // );
    } else {
      return [];
    }
  }, [date, treatments]);

  useEffect(() => {
    getProfile();
  }, [getProfile]);
  return (
    <div className="h-[400px] w-1/3 bg-slate-100 rounded-xl p-4">
      <AddTreatmentModal
        refetch={getProfile}
        setShow={setShow}
        show={show}
        date={date}
        customerId={custId}
        deviceToken={treatment.deviceToken ?? ""}
        registerNo={registerNo}
      />
      <div className="font-bold text-black text-[16px] text-center mb-2">
        {date}
      </div>
      <div className="text-indigo-600 text-center text-[14px] font-medium">
        Хийгдэж буй эмчилгээ
      </div>
      <div className="flex w-full h-[calc(100%_-_120px)] border-2 rounded-md p-2 my-2 gap-2 overflow-hidden border-orange-200 flex-wrap justify-around hover:overflow-scroll">
        {data.map((item, index) => (
          <TreatmentBox key={index} {...item} />
        ))}
      </div>
      <button
        className="h-[36px] bg-orange-200 rounded-md w-full justify-self-end font-bold text-[16px] text-black hover:opacity-80"
        onClick={(e) => {
          e.preventDefault();
          addTreatment();
        }}
      >
        Эмчилгээ нэмэх
      </button>
    </div>
  );
}
