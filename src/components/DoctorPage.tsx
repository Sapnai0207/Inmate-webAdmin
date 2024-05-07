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
    } catch (error) {
      message.error("Алдаа гарлаа! Дахин оролдоно уу.", 2);
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
                formatter={(value, name) => [`Амжилттай болсон тоо: ${value}`]}
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
                  const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                  const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
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
      </div>
    </SideBar>
  );
}
