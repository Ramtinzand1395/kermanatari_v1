"use client";

import { LucideIcon } from "lucide-react";

type ColorType = "indigo" | "green" | "amber" | "blue";

const colorClasses: Record<ColorType, string> = {
  indigo: "bg-indigo-50 text-indigo-600",
  green: "bg-green-50 text-green-600",
  amber: "bg-amber-50 text-amber-600",
  blue: "bg-blue-50 text-blue-600",
};

interface StoreOrderCartProps {
  title: string;
  // value: string | number;
  icon: LucideIcon;
  link?: string;
  color: ColorType;
}

const StoreOrderCart = ({
  title,
  // value,
  icon: Icon,
  link,
  color,
}: StoreOrderCartProps) => {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          {/* <h3 className="mt-2 text-xs text-gray-900">{value}</h3> */}

          <button className="text-blue-600 text-xs cursor-pointer">
            مشاهده همه
          </button>
        </div>
        <div className={`rounded-lg p-3 ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};

export default StoreOrderCart;
