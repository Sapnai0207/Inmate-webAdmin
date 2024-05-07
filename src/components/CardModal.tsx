import React, { Dispatch, useCallback, useState } from "react";

import { Button, Form, Modal, Select, message } from "antd";
import { TreatmentStates } from "@/utils/types";
import { useForm } from "antd/es/form/Form";
import axios from "axios";
import { ChangeTreatmentStateReq } from "@/controllers/treat/types";

type CardModalProps = {
  show: boolean;
  setShow: Dispatch<boolean>;
  _id: string;
  refetch: () => void;
};

export default function CardModal({
  setShow,
  show,
  _id,
  refetch,
}: CardModalProps) {
  const [form] = useForm();
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const changeState = useCallback(
    async (req: ChangeTreatmentStateReq) => {
      setLoading(true);
      try {
        const response = await axios.post("/api/admin/treatstates", req, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data) {
          refetch();
          setLoading(false);
          setShow(false);
          message.success("Амжилттай шинэчлэгдлээ.", 2);
        }
      } catch (err) {
        setLoading(false);
        message.error("Алдаа гарлаа.", 2);
      }
    },
    [refetch, setShow, token]
  );
  return (
    <Modal
      open={show}
      title="Төлөв шинэчлэх"
      onCancel={() => setShow(false)}
      className="flex w-[60%] h-1/3 flex-col"
      confirmLoading={loading}
      footer={[
        <Button
          key="submit"
          loading={loading}
          onClick={() => {
            changeState({ _id: _id, states: form.getFieldValue("state") });
          }}
          type="primary"
        >
          Хадгалах
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item required name="state">
          <Select className="w-full">
            <Select.Option value={TreatmentStates.Done}>
              Амжилттай
            </Select.Option>
            <Select.Option value={TreatmentStates.Cancel}>
              Цуцалсан
            </Select.Option>
            <Select.Option value={TreatmentStates.Pending}>
              Хүлээгдэж буй
            </Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}
