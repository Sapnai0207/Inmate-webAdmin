import React, { Dispatch, useCallback, useState } from "react";

import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  TimePicker,
  message,
} from "antd";

import { useForm } from "antd/es/form/Form";
import { TreatmentList } from "@/utils/customData";
import axios from "axios";
import dayjs from "dayjs";

type AddTreatmentModalProps = {
  show: boolean;
  setShow: Dispatch<boolean>;
  date: string;
  customerId: string;
  refetch: () => void;
  deviceToken: string;
  registerNo: string;
};

export default function AddTreatmentModal({
  setShow,
  show,
  date,
  customerId,
  deviceToken,
  registerNo,
  refetch,
}: AddTreatmentModalProps) {
  const [form] = useForm();
  const [loading, setLoading] = useState(false);
  const addTreatment = useCallback(async () => {
    const token = localStorage.getItem("token");
    const treatment = TreatmentList[form.getFieldValue("treatment")];
    const startHour = form.getFieldValue("startDate");
    const endHour = form.getFieldValue("endDate");
    const roomNumber = form.getFieldValue("roomNumber");
    setLoading(true);
    const startDate =
      dayjs(date).format("YYYY-MM-DD") +
      "T" +
      dayjs(startHour).format("HH:mm:ssZ[Z]");
    const endDate =
      dayjs(date).format("YYYY-MM-DD") +
      "T" +
      dayjs(endHour).format("HH:mm:ssZ[Z]");
    try {
      const response = await axios.post(
        "/api/admin/treat",
        {
          customerId: customerId,
          states: "Хүлээгдэж байгаа",
          information: treatment.information,
          startDate: startDate,
          endDate: endDate,
          roomNumber: form.getFieldValue("roomNumber"),
          title: treatment.title,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!!deviceToken && deviceToken.length > 0) {
        const sendNotif = await axios.post("/api/admin/sendNotification", {
          deviceToken: deviceToken,
          registerNo: registerNo,
          title: treatment.title,
          description: treatment.information,
          date: date,
          roomNumber: roomNumber + "",
        });
      }
      setLoading(false);
      form.resetFields();
      refetch();
      setShow(false);
      message.success("Амжилттай эмчилгээ нэмэгдлээ", 2);
    } catch (err) {
      message.error("Алдаа гарлаа", 2);
      setLoading(false);
    }
  }, [customerId, date, deviceToken, form, refetch, registerNo, setShow]);

  return (
    <Modal
      open={show}
      onCancel={() => setShow(false)}
      title="Эмчилгээ нэмэх"
      confirmLoading={loading}
      footer={[
        <button
          key="submit"
          disabled={loading}
          onClick={addTreatment}
          className="w-[60%] me-[20%] bg-orange-200 text-black font-bold text-[16px] rounded-md h-[36px] hover:opacity-80"
        >
          Нэмэх
        </button>,
      ]}
    >
      <Form layout="vertical" form={form} autoComplete="off">
        <Form.Item
          label="Эмчилгээ"
          name="treatment"
          required
          rules={[{ required: true, message: "Эмчилгээ сонгоно уу" }]}
        >
          <Select>
            {TreatmentList.map((item, index) => (
              <Select.Option value={index} key={index}>
                {item.title}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="startDate"
          label="Эхлэх цаг"
          required
          rules={[{ required: true, message: "Эхлэх цаг сонгоно уу" }]}
        >
          <TimePicker />
        </Form.Item>
        <Form.Item
          name="endDate"
          label="Дуусах цаг"
          required
          rules={[{ required: true, message: "Дуусах цаг  сонгоно уу" }]}
        >
          <TimePicker />
        </Form.Item>
        <Form.Item
          label="Эмчилгээны өрөө"
          name="roomNumber"
          className="w-[60%]"
          required
          rules={[{ required: true, message: "Эмчилгээны өрөө сонгоно уу" }]}
        >
          <Input type="number" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
