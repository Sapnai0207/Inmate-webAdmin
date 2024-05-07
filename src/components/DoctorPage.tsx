import React, { useCallback, useEffect, useMemo, useState } from "react";
import SideBar from "./SideBar";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TreatmentStates } from "../utils/types";
import axios from "axios";
import { message } from "antd";
import { Customer, Treatment } from "@/services/db/types";

type ChartType = {
  date: string;
  cnt: number;
};

type StatisticType = {
  count: number;
  name: string;
};
const colors = ["#8884d8", "#83a6ed", "#8dd1e1", "#82ca9d", "#a4de6c"];
export default function DoctorPage() {
  const [treatment, setTreatment] = useState<Treatment[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [treatLoading, setTreatLoading] = useState(true);
  const [custLoading, setCustLoading] = useState(true);
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
      setTreatLoading(false);
    } catch (err) {
      message.error("Алдаа гарлаа! Дахин оролдоно уу.", 2);
      setTreatLoading(false);
    }
  }, []);

  const getAllCustomers = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/admin/custlist?full=true", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response, "response");
      setCustomers(response.data.list);
      console.log("CUSTLIST:", response.data);
      setCustLoading(false);
    } catch (error) {
      message.error("Алдаа гарлаа! Дахин оролдоно уу.", 2);
      setCustLoading(false);
    }
  }, []);

  useEffect(() => {
    getAllTreat();
    getAllCustomers();
  }, [getAllCustomers, getAllTreat]);
  const treatments = useMemo(() => {
    const data: ChartType[] = [];
    const filteredInpatient = treatment.filter(
      (treat) => treat.states === TreatmentStates.Done
    );
    filteredInpatient.map((item) => {
      // const date = new Date(item.startDate);
      const dd = item.startDate.toString().substring(0, 10);
      // console.log(date, "sda");
      if (data.length === 0) {
        data.push({
          date: item.startDate.toString().substring(0, 10),
          cnt: 1,
        });
      } else {
        if (data.find((val) => val.date === dd)) {
          const index = data.findIndex((val) => val.date === dd);
          data[index].cnt++;
        } else {
          data.push({
            date: dd,
            cnt: 1,
          });
        }
      }
    });
    data.sort();
    data.reverse();
    return data;
  }, [treatment]);

  const statistic = useMemo(() => {
    const data: StatisticType[] = [
      { name: "Бүртгэгдсэн хэрэглэгч", count: 0 },
      { name: "Бүртгэгдсэн эмчилгээ", count: 0 },
    ];
    data[0].count = customers.length;
    data[1].count = treatment.length;
    return data;
  }, [customers.length, treatment.length]);

  return (
    <SideBar selectedId="home">
      <div className="h-full w-full bg-[#fadcc3] flex flex-col p-8 items-center">
        {treatLoading || custLoading ? (
          <div
            role="status"
            className="w-full h-full flex justify-center items-center"
          >
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        ) : (
          <>
            <div className="w-[80%] h-2/5 flex flex-col relative">
              <div className="font-bold text-white text-[20px] text-center mb-4">
                Амжилттай болсон эмчилгээний статистик
              </div>
              <ResponsiveContainer className="rounded-sm w-full h-full">
                <BarChart
                  className="bg-white rounded-xl w-full h-full"
                  data={treatments}
                  margin={{
                    top: 20,
                    right: 20,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [
                      `Амжилттай болсон тоо: ${value}`,
                    ]}
                  />
                  <Legend formatter={() => [`Амжилттай болсон тоо`]} />
                  <Bar
                    dataKey="cnt"
                    maxBarSize={75}
                    fill="#8884d8"
                    activeBar={<Rectangle fill="pink" stroke="blue" />}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="w-[80%] h-3/5 relative flex flex-col mt-4">
              <div className="font-bold text-white text-[20px] text-center mb-4">
                Үйлчилгээний статистик
              </div>
              <ResponsiveContainer className="w-full h-[1000px] p-0">
                <PieChart className="w-full h-full">
                  <Pie
                    data={statistic}
                    dataKey="count"
                    cx="50%"
                    cy="50%"
                    outerRadius={200}
                    startAngle={90}
                    endAngle={450}
                    paddingAngle={0}
                    labelLine={false}
                    minAngle={8}
                    label={({
                      cx,
                      cy,
                      midAngle,
                      innerRadius,
                      outerRadius,
                      index,
                    }) => {
                      const radius =
                        innerRadius + (outerRadius - innerRadius) * 0.5;
                      const x =
                        cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                      const y =
                        cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                      return (
                        <text
                          className="font-bold text-center text-[12px]"
                          x={x}
                          y={y}
                          fill="#000"
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          {statistic[index].name}: {statistic[index].count}
                        </text>
                      );
                    }}
                    fill="#8884d8"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </SideBar>
  );
}
