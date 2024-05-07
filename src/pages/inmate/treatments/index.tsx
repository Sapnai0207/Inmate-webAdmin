import React, { useCallback, useEffect, useMemo, useState } from "react";

import SideBar from "../../../components/SideBar";
import { message } from "antd";
import TreatmentsProfile from "../../../components/TreatmentsProfile";
import Search from "antd/es/input/Search";
import axios from "axios";
import { Customer } from "@/services/db/types";
import dayjs from "dayjs";

export default function Index() {
  const [users, setUsers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/admin/custlist?full=true", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response, "response");
      setUsers(response.data.list);
      setLoading(false);
      console.log("CUSTLIST:", response.data);
    } catch (error) {
      setLoading(false);
      message.error("Алдаа гарлаа! Дахин оролдоно уу.", 2);
    }
  }, []);

  const filteredData: Customer[] = useMemo(() => {
    if (users) {
      const searchedVal = input.toLowerCase();
      if (searchedVal.length > 0) {
        return users.filter(
          (user) =>
            user.registerNo.toLowerCase().includes(searchedVal) ||
            dayjs(user.startOfPatient)
              .format("YYYY-MM-DD")
              .toLowerCase()
              .includes(searchedVal)
        );
      } else {
        return users;
      }
    }
    return [];
  }, [input, users]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return (
    <SideBar selectedId="treatments">
      <div className="w-full h-full bg-[#fadcc3] flex-col p-8">
        <Search
          placeholder="Хайх"
          className="h-[30px] w-1/3 mb-8"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="flex h-[calc(100%_-_2rem)] w-full gap-8 overflow-y-auto flex-wrap hover: overflow-scroll justify-center">
          {loading ? (
            <button type="button" className="w-[24px] h-[24px]" disabled>
              <svg
                className="animate-spin h-5 w-5 mr-3"
                viewBox="0 0 24 24"
              ></svg>
              Loading...
            </button>
          ) : (
            filteredData.map((item, index) => (
              <TreatmentsProfile treatment={item} key={index} />
            ))
          )}
        </div>
      </div>
    </SideBar>
  );
}
