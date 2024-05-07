import { FormEvent, useContext, useState } from "react";

import { message } from "antd";
import { Doctor, Nurse } from "@/utils/customData";
import { useRouter } from "next/router";
import { AuthContext } from "@/contexts/AuthProvider";
import axios from "axios";
import React from "react";
import jwt from "jsonwebtoken";

export default function Index() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { setProfile } = useContext(AuthContext);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/api/user/login", {
        email: email,
        password: password,
      });

      localStorage.setItem("token", response.data.token);
      const decodedToken = jwt.decode(response.data.token);
      if (decodedToken != null && decodedToken) {
        //@ts-ignore
        if (decodedToken.role && decodedToken?.role === "DOCTOR") {
          setProfile(Doctor);
        }
        //@ts-ignore
        else if (decodedToken.role && decodedToken.role === "NURSE") {
          setProfile(Nurse);
        }
        await router.push("inmate");
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      message.error("Хэрэглэгчийн и-мейл хаяг эсвэл нууц үг буруу байна.", 2);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Нэвтрэх
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={login}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="off"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="И-мейл хаяг"
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="off"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Нууц үг"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.373A8 8 0 0112 4v4a7.946 7.946 0 00-2 .27V5.373C8 4.597 8.597 4 9.373 4H10v8.6l-.801.4a7.928 7.928 0 00-1.333 2.73L4 17.373zM12 20v-4c1.374 0 2.643-.438 3.687-1.178l.801.4V20h-4z"
                  ></path>
                </svg>
              ) : (
                "Нэвтрэх"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
