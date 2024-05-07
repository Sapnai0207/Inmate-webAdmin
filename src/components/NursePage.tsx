import React, { useCallback, useEffect, useMemo, useState } from "react";
import Search from "./Search";
import { Users } from "@/utils/customData";
import Pagination from "./Pagination";
import { TreatmentStates } from "@/utils/types";
import PaginationCard from "./PaginationCard";
import axios from "axios";
import { message } from "antd";
import { Customer, Treatment } from "@/services/db/types";

export interface SearchTreatment {
  userName: string;
  registerNo: string;
  date: Date;
  states: TreatmentStates;
  information: string;
  title: string;
  roomNumber: number;
}

export default function NursePage() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const pageSize: number = 4; // Number of items per page
  const totalItems: number = Users.length;
  const totalPages: number = Math.ceil(totalItems / pageSize);

  const [treatment, setTreatment] = useState<Treatment[]>([]);
  const getAllTreat = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/admin/alltreat", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data) {
        setTreatment(response.data.list);
      }
    } catch (err) {
      message.error("Алдаа гарлаа! Дахин оролдоно уу.", 2);
    }
  }, []);

  useEffect(() => {
    getAllTreat();
  }, [getAllTreat]);

  // const data = useMemo(() => {
  //   const searchTreatmentData: SearchTreatment[] = [];
  //   Users.filter((val) => val.treatments.length > 0).map((item) =>
  //     item.treatments.map((treat) =>
  //       searchTreatmentData.push({
  //         date: treat.date,
  //         information: treat.information,
  //         registerNo: item.registerNo,
  //         roomNumber: treat.roomNumber,
  //         states: treat.states,
  //         title: treat.title,
  //         userName: item.firstname,
  //       })
  //     )
  //   );
  //   return searchTreatmentData;
  // }, []);

  const searchedData = useMemo(() => {
    return treatment.filter(
      (patient) =>
        patient.roomNumber?.toString()?.toLowerCase().includes(searchTerm) ||
        patient.registerNo?.toLowerCase().includes(searchTerm) ||
        patient.title?.toLowerCase().includes(searchTerm)
    );
  }, [treatment, searchTerm]);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term.toLowerCase());
    setCurrentPage(1);
  };

  return (
    <div className="h-screen w-screen bg-[#fadcc3] flex flex-col">
      <div className="w-full bg-orange-200 h-16 text-center font-bold text-[17px] text-black flex items-center justify-center mb-6">
        Эмчилгээны лист
      </div>
      <Search searchTerm={searchTerm} onSearchChange={handleSearchChange} />
      <div className="w-full h-full flex-wrap flex p-8 gap-8 justify-center overflow-scroll">
        {searchedData.map((patient, index) => (
          <PaginationCard
            key={index}
            refetch={getAllTreat}
            treatment={patient}
          />
        ))}
      </div>
      {/* <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      /> */}
    </div>
  );
}
