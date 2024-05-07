import React from "react";

type PrimaryButtonProps = {
  onClick: () => void;
  title: string;
};

export default function PrimaryButton({ onClick, title }: PrimaryButtonProps) {
  return (
    <button
      onClick={(event) => {
        event.preventDefault();
        onClick();
      }}
      className="h-[36px] w-full rounded-xl bg-orange-200 hover:opacity-80 font-bold text-black text-sm"
    >
      {title}
    </button>
  );
}
