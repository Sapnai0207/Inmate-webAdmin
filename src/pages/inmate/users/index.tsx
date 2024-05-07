import React, { Fragment, useCallback, useRef, useState } from "react";

import {
  Button,
  DatePicker,
  Flex,
  Form,
  Input,
  Select,
  Tooltip,
  Tour,
  TourProps,
  message,
} from "antd";
import SideBar from "../../../components/SideBar";
import { useForm } from "antd/es/form/Form";
import dayjs from "dayjs";
import axios from "axios";

import { Inpatient } from "../../../utils/customData";
import { Gender, MedicalHistoryType } from "../../../utils/types";

import {
  SearchOutlined,
  PlusOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import MedicalHistoryModal from "../../../components/MedicalHistoryModal";
import TreatmentSection from "@/components/TreatmentSection";

const genderType: Record<Gender, string> = {
  [Gender.Male]: "Эрэгтэй",
  [Gender.Woman]: "Эмэгтэй",
  [Gender.Other]: "Бусад",
};

export default function Index() {
  const [form] = useForm<Inpatient>();
  const [searchID, setSearchID] = useState("");
  const [custId, setCustId] = useState("");
  const [findLoading, setFindLoading] = useState(false);
  const [finishLoading, setFinishLoading] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onSearch = useCallback(async () => {
    setFindLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "/api/admin/singlecust?register=" + searchID,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      form.setFieldValue("firstname", response.data.firstname);
      form.setFieldValue("lastname", response.data.lastname);
      form.setFieldValue("registerNo", response.data.registerNo);
      form.setFieldValue("age", parseInt(response.data.age, 10));
      form.setFieldValue("gender", response.data.gender);
      if (response.data.startOfPatient) {
        form.setFieldValue(
          "startOfPatient",
          dayjs(response.data.startOfPatient)
        );
      }
      if (response.data.days) {
        form.setFieldValue("days", response.data.days);
      }
      if (response.data.diagnoses) {
        setHistory(response.data.diagnoses);
      }
      setCustId(response.data._id);
      console.log("CUST: ", response.data);
      setFindLoading(false);
    } catch (error) {
      setFindLoading(false);
    }
  }, [form, searchID]);

  const onRegister = useCallback(async () => {
    setFinishLoading(true);
    try {
      const register = await axios.post("/api/user/register", {
        password: form.getFieldValue("password"),
        phone: form.getFieldValue("phone"),
        registerNo: form.getFieldValue("registerNo"),
        firstname: form.getFieldValue("firstname"),
        lastname: form.getFieldValue("lastname"),
        age: form.getFieldValue("age"),
        gender: form.getFieldValue("gender"),
      });
      const token = localStorage.getItem("token");
      const getCust = await axios.get(
        "/api/admin/singlecust?register=" + register.data.registerNo,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCustId(getCust.data._id);
      const startDate = dayjs(form.getFieldValue("startOfPatient")).format(
        "YYYY-MM-DDTHH:mm:ss"
      );

      const resDate = await axios.post(
        "/api/admin/setdate",
        {
          customerId: getCust.data._id,
          startDate: startDate,
          days: form.getFieldValue("days"),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFinishLoading(false);
      form.resetFields();
      setHistory([]);
      message.success("Амжилттай бүртгэгдлээ", 2);
    } catch (err) {
      message.error("Бүртгэгдсэн хэрэглэгч байна.", 2);
      setFinishLoading(false);
    }
  }, [form]);

  const onFinish = useCallback(async () => {
    setFinishLoading(true);
    try {
      const startDate = dayjs(form.getFieldValue("startOfPatient")).format(
        "YYYY-MM-DDTHH:mm:ss"
      );
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "/api/admin/setdate",
        {
          customerId: custId,
          startDate: startDate,
          days: form.getFieldValue("days"),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res);
      setFinishLoading(false);
      form.resetFields();
      message.success("Амжилттай хадгалагдлаа", 2);
      setHistory([]);
    } catch (err) {
      message.error("aldaa", 2);
      setFinishLoading(false);
    }
  }, [custId, form]);

  const deleteDiagnose = useCallback(
    async (selectedDiagnose: string) => {
      const token = localStorage.getItem("token");
      console.log("delete diagnose selected: ", selectedDiagnose);
      try {
        const resp = await axios.post(
          "/api/admin/deletediagnose",
          {
            _id: selectedDiagnose,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Delete diagnose rsponse: ", resp);
        message.success("Онош устгагдлаа");
      } catch (error) {
        message.error("error");
      }
      onSearch();
    },
    [onSearch]
  );

  // history controllers
  const [history, setHistory] = useState<MedicalHistoryType[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [tourHistory, setTourHistory] = useState<MedicalHistoryType | null>(
    null
  );

  const steps: TourProps["steps"] = [
    {
      title: "Өвчний тодорхойлолт",
      description: tourHistory?.diseaseDescription,
      className: "font-bold text-[17px]",
      prevButtonProps: { children: "Өмнөх", className: "h-10 text-[16px]" },
      nextButtonProps: { children: "Дараах", className: "h-10 text-[16px]" },
    },
    {
      title: "Өвчний шалтгаан",
      description: tourHistory?.diseaseCause,
      className: "font-bold text-[17px]",
      prevButtonProps: { children: "Өмнөх", className: "h-10 text-[16px]" },
      nextButtonProps: { children: "Дараах", className: "h-10 text-[16px]" },
    },
    {
      title: "Эмийн эмчилгээ",
      description: tourHistory?.medicalTreatments,
      className: "font-bold text-[17px]",
      prevButtonProps: { children: "Өмнөх", className: "h-10 text-[16px]" },
      nextButtonProps: { children: "Дараах", className: "h-10 text-[16px]" },
    },
    {
      title: "Физик эмчилгээ",
      description: tourHistory?.physicalTreatments,
      className: "font-bold text-[17px]",
      prevButtonProps: { children: "Өмнөх", className: "h-10 text-[16px]" },
      nextButtonProps: { children: "Дараах", className: "h-10 text-[16px]" },
    },
    {
      title: "Оношлогдсон өдөр",
      description: tourHistory?.diagnosedDate.toString(),
      className: "font-bold text-[17px]",
      prevButtonProps: { children: "Өмнөх", className: "h-10 text-[16px]" },
      nextButtonProps: { children: "Дараах", className: "h-10 text-[16px]" },
    },
  ];

  return (
    <SideBar selectedId="users">
      <MedicalHistoryModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        setHistory={setHistory}
        customerId={custId}
      />
      {selected === null && <TreatmentSection setSelect={setSelected} />}
      {selected === 2 && (
        <div className="w-full h-full bg-[#fadcc3] flex flex-col justify-center">
          <Form
            form={form}
            layout="vertical"
            className="w-full max-w-md mx-auto bg-[#f1fbfc] rounded-lg shadow-lg px-8 pt-6 pb-8 mb-4"
            onFinish={onRegister}
          >
            <Form.Item
              name="firstname"
              label="Хэрэглэгчийн нэр"
              required
              rules={[
                {
                  required: true,
                  message: "Хэрэглэгчийн нэрийг оруулна уу",
                },
              ]}
            >
              <Input className="w-full" disabled={findLoading} />
            </Form.Item>
            <Form.Item
              name="lastname"
              label="Хэрэглэгчийн овог"
              required
              rules={[
                {
                  required: true,
                  message: "Хэрэглэгчийн овогийг оруулна уу",
                },
              ]}
            >
              <Input className="w-full" disabled={findLoading} />
            </Form.Item>
            <Form.Item
              name="registerNo"
              label="Регистрийн дугаар"
              required
              rules={[
                {
                  required: true,
                  message: "Регистрийн дугаар оруулна уу",
                  len: 10,
                },
              ]}
            >
              <Input className="w-full" maxLength={10} disabled={findLoading} />
            </Form.Item>
            <Form.Item
              name="phone"
              label="Утасны дугаар"
              required
              rules={[
                {
                  required: true,
                  message: "Утасны дугаар оруулна уу",
                  len: 8,
                },
              ]}
            >
              <Input className="w-full" maxLength={8} />
            </Form.Item>
            <Form.Item
              name="age"
              label="Хэрэглэгчийн нас"
              rules={[
                {
                  required: true,
                  message: "Хэрэглэгчийн насыг оруулна уу",
                },
              ]}
            >
              <Input
                className="w-full"
                type="number"
                maxLength={3}
                disabled={findLoading}
              />
            </Form.Item>
            <Form.Item
              name="gender"
              label="Хүйс"
              required
              rules={[
                {
                  required: true,
                  message: "Хүйс сонгоно уу",
                },
              ]}
            >
              <Select className="w-full">
                <Select.Option value={genderType[Gender.Male]}>
                  Эрэгтэй
                </Select.Option>
                <Select.Option value={genderType[Gender.Woman]}>
                  Эмэгтэй
                </Select.Option>
                <Select.Option value={genderType[Gender.Other]}>
                  Бусад
                </Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="days"
              label="Хэвтэн эмчлүүлэх хугацаа"
              required
              rules={[
                {
                  required: true,
                  message: "Хэвтэн эмчлүүлэх хугацааг сонгоно уу",
                },
              ]}
            >
              <Input type="number" className="w-full" disabled={findLoading} />
            </Form.Item>
            <Form.Item
              name="startOfPatient"
              label="Хэвтэн эмчлүүлэх өдөр"
              required
              rules={[
                { required: true, message: "Хэвтэн эмчлүүлэх өдөр сонгоно уу" },
              ]}
            >
              <DatePicker className="w-full" />
            </Form.Item>
            <Form.Item
              name="password"
              label="Нууц үг"
              required
              rules={[{ required: true, message: "Нууц үг оруулна уу" }]}
            >
              <Input.Password
                iconRender={(visible) =>
                  visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>
            {/* <Form.Item name="medicalHistory" label="Өвчтөний онош">
              <Flex wrap="wrap" gap="small">
                {history.map((item, index) => (
                  <Fragment key={item._id + "" + index + ""}>
                    <Button
                      type="primary"
                      className="rounded-full"
                      onClick={(event) => {
                        event.preventDefault();
                        setTourHistory(item);
                      }}
                    >
                      Онош {index + 1}
                    </Button>
                    <Tour
                      open={!!tourHistory}
                      onClose={() => setTourHistory(null)}
                      steps={steps}
                    />
                    <Button
                      className="rounded-full"
                      onClick={() => {
                        console.log("Delete diagnose: ", item._id);
                        deleteDiagnose(item._id);
                      }}
                    >
                      Устгах
                    </Button>
                  </Fragment>
                ))}
                <Tooltip title="Нэмэх">
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<PlusOutlined />}
                    onClick={(event) => {
                      event.preventDefault();
                      setIsOpen(true);
                    }}
                  />
                </Tooltip>
              </Flex>
            </Form.Item> */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full"
                loading={findLoading || finishLoading}
              >
                Бүртгэх
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}
      {selected === 1 && (
        <div className="w-full h-full bg-[#fadcc3] flex flex-col">
          <div className="relative self-center w-full my-10 flex gap-4 justify-center">
            <input
              type="search"
              ref={inputRef}
              maxLength={10}
              placeholder="Регистрийн дугаараар хайх"
              className="w-1/3 relative p-4 rounded-full bg-slate-800 justify-self-center"
              onChange={(event) => {
                setSearchID(event.target.value);
              }}
            />
            <button
              className="p-4 bg-slate-600 rounded-full"
              onClick={(event) => {
                event.preventDefault();
                onSearch();
              }}
            >
              <SearchOutlined />
            </button>
          </div>
          <Form
            form={form}
            layout="vertical"
            className="w-full max-w-md mx-auto bg-[#f1fbfc] rounded-lg shadow-lg px-8 pt-6 pb-8 mb-4"
            onFinish={onFinish}
          >
            <Form.Item
              name="firstname"
              label="Хэрэглэгчийн нэр"
              required
              rules={[
                {
                  required: true,
                  message: "Хэрэглэгчийн нэрийг оруулна уу",
                },
              ]}
            >
              <Input className="w-full" disabled={findLoading} />
            </Form.Item>
            <Form.Item
              name="lastname"
              label="Хэрэглэгчийн овог"
              required
              rules={[
                {
                  required: true,
                  message: "Хэрэглэгчийн овогийг оруулна уу",
                },
              ]}
            >
              <Input className="w-full" disabled={findLoading} />
            </Form.Item>
            <Form.Item
              name="registerNo"
              label="Регистрийн дугаар"
              required
              rules={[
                {
                  required: true,
                  message: "Регистрийн дугаар оруулна уу",
                  len: 10,
                },
              ]}
            >
              <Input className="w-full" maxLength={10} disabled={findLoading} />
            </Form.Item>
            <Form.Item
              name="age"
              label="Хэрэглэгчийн нас"
              rules={[
                {
                  required: true,
                  message: "Хэрэглэгчийн насыг оруулна уу",
                },
              ]}
            >
              <Input
                className="w-full"
                type="number"
                maxLength={3}
                disabled={findLoading}
              />
            </Form.Item>
            <Form.Item
              name="gender"
              label="Хүйс"
              required
              rules={[
                {
                  required: true,
                  message: "Хүйс сонгоно уу",
                },
              ]}
            >
              <Select className="w-full">
                <Select.Option value={genderType[Gender.Male]}>
                  Эрэгтэй
                </Select.Option>
                <Select.Option value={genderType[Gender.Woman]}>
                  Эмэгтэй
                </Select.Option>
                <Select.Option value={genderType[Gender.Other]}>
                  Бусад
                </Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="days"
              label="Хэвтэн эмчлүүлэх хугацаа"
              required
              rules={[
                {
                  required: true,
                  message: "Хэвтэн эмчлүүлэх хугацааг сонгоно уу",
                },
              ]}
            >
              <Input type="number" className="w-full" disabled={findLoading} />
            </Form.Item>
            <Form.Item
              name="startOfPatient"
              label="Хэвтэн эмчлүүлэх өдөр"
              required
              rules={[
                { required: true, message: "Хэвтэн эмчлүүлэх өдөр сонгоно уу" },
              ]}
            >
              <DatePicker className="w-full" />
            </Form.Item>
            <Form.Item name="medicalHistory" label="Өвчтөний онош">
              <Flex wrap="wrap" gap="small">
                {history.map((item, index) => (
                  <Fragment key={item._id + "" + index + ""}>
                    <Button
                      type="primary"
                      className="rounded-full"
                      onClick={(event) => {
                        event.preventDefault();
                        setTourHistory(item);
                      }}
                    >
                      Онош {index + 1}
                    </Button>
                    <Tour
                      open={!!tourHistory}
                      onClose={() => setTourHistory(null)}
                      steps={steps}
                    />
                    <Button
                      className="rounded-full"
                      onClick={() => {
                        console.log("Delete diagnose: ", item._id);
                        deleteDiagnose(item._id);
                      }}
                    >
                      Устгах
                    </Button>
                  </Fragment>
                ))}
                <Tooltip title="Нэмэх">
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<PlusOutlined />}
                    onClick={(event) => {
                      event.preventDefault();
                      setIsOpen(true);
                    }}
                  />
                </Tooltip>
              </Flex>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full"
                loading={findLoading || finishLoading}
              >
                Бүртгэх
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}
    </SideBar>
  );
}
