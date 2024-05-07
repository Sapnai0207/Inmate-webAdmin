import React, { useEffect, useState } from "react";
import DoctorPage from "../../components/DoctorPage";
import NursePage from "../../components/NursePage";
import jwt from "jsonwebtoken";

export default function Index() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = jwt.decode(token);
        //@ts-ignore
        if (decodedToken != null && decodedToken.role) {
          //@ts-ignore
          setRole(decodedToken.role);
        }
      }
    }
  }, []);

  return (
    <>
      {role !== null && role === "DOCTOR" && <DoctorPage />}
      {role !== null && role === "NURSE" && <NursePage />}
      {role === null && <div>Please log in!</div>}
    </>
  );
}
