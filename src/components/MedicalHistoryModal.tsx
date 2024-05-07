import React, { Dispatch } from "react";

import { Button, DatePicker, Form, Input, Modal, Switch } from "antd";
import { MedicalHistoryType } from "@/utils/types";
import { useForm } from "antd/es/form/Form";
import dayjs from "dayjs";
import axios from "axios";

type MedicalHistoryModalProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  setHistory: Dispatch<MedicalHistoryType[]>;
  customerId: string;
};

export default function MedicalHistoryModal({
  isOpen,
  setHistory,
  setIsOpen,
  customerId,
}: MedicalHistoryModalProps) {
  const [form] = useForm<MedicalHistoryType>();
  let token;
  let response;

  async function onFinish(values: MedicalHistoryType) {
    //@ts-ignore -> aldaa untraadag
    setHistory((currentHistory: MedicalHistoryType[]) => {
      values._id = currentHistory.length + 1 + ""; // _id special baih ystoi bolhor back dre generate hiine
      values.completelyRecovered = false; // emchilge burtgej baiga bolhor ugasa edgeegu gj uzle
      return [...currentHistory, values];
    });
    setIsOpen(false);
    try {
      token = localStorage.getItem("token");
      console.log("add trtment token", token);
      const body = {
        customerId: customerId,
        diseaseDescription: form.getFieldValue("diseaseDescription"),
        diseaseCause: form.getFieldValue("diseaseCause"),
        medicalTreatments: form.getFieldValue("medicalTreatments"),
        physicalTreatments: form.getFieldValue("physicalTreatments"),
        diagnosedDate: form.getFieldValue("diagnosedDate"),
        completelyRecovered: form.getFieldValue("fullyRecovered"),
      };
      console.log("add trtment body", body);
      const response = await axios.post("/api/admin/diagnose", body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("add diagnose response: ", response);
    } catch (error) {
      console.log("ERROR", error);
    }
  }

  return (
    <Modal open={isOpen} onCancel={() => setIsOpen(false)} footer={[]}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="diseaseDescription"
          label="Өвчний тодорхойлолт"
          required
          rules={[
            {
              required: true,
              message: "Өвчний тодорхойлолт оруулна уу.",
            },
          ]}
        >
          <Input.TextArea rows={3} allowClear />
        </Form.Item>
        <Form.Item
          name="diseaseCause"
          label="Өвчний шалтгаан"
          required
          rules={[
            {
              required: true,
              message: "Өвчний шалтгаан оруулна уу.",
            },
          ]}
        >
          <Input.TextArea rows={3} allowClear />
        </Form.Item>
        <Form.Item
          name="medicalTreatments"
          label="Эмнэлэгийн эмчилгээ"
          required
          rules={[
            {
              required: true,
              message: "Эмнэлэгийн эмчилгээ оруулна уу.",
            },
          ]}
        >
          <Input.TextArea rows={3} allowClear />
        </Form.Item>
        <Form.Item
          name="physicalTreatments"
          label="Физик эмчилгээ"
          required
          rules={[
            {
              required: true,
              message: "Эмнэлэгийн эмчилгээ оруулна уу.",
            },
          ]}
        >
          <Input.TextArea rows={3} allowClear />
        </Form.Item>
        <Form.Item
          name="diagnosedDate"
          label="Оношлогдсон огноо"
          required
          rules={[
            {
              required: true,
              message: "Огноо оруулна уу.",
            },
          ]}
        >
          <DatePicker placeholder="Өдөр" />
        </Form.Item>
        <Form.Item
          name="fullyRecovered"
          label="Бүрэн эдгэрсэн эсэх"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-[80%] justify-self-center ms-[10%]"
          >
            Хадгалах
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
