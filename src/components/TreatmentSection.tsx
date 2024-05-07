import { Tooltip } from "antd";
import React, { Dispatch } from "react";

type TreatmentSectionProps = {
  setSelect: Dispatch<number | null>;
};

export default function TreatmentSection({ setSelect }: TreatmentSectionProps) {
  return (
    <div className="w-full h-full bg-[#fadcc3] flex items-center justify-center flex-col gap-8">
      <Tooltip title="Шинээр хэрэглэгч бүртгэх болон хэвтэн эмчлүүлэх бүртгэл хийх">
        <button
          className="w-[250px] bg-[#febf00] rounded h-14 font-bold animate-fade transform transition duration-500 hover:scale-110"
          onClick={() => setSelect(2)}
        >
          Шинэ өвчтөн бүртгэх
        </button>
      </Tooltip>
      <Tooltip title="Бүртгэгдсэн хэрэглэгчид хэвтэн эмчлүүлэх бүртгэл хийх болон онош, бүртгэл шинэчлэх">
        <button
          className="w-[250px] bg-[#febf00] rounded h-14 font-bold animate-fade transform transition duration-500 hover:scale-110"
          onClick={() => setSelect(1)}
        >
          Өвчтөны бүртгэл шинэчлэх
        </button>
      </Tooltip>
    </div>
  );
}
