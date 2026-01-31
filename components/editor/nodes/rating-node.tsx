"use client";

import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Star } from "lucide-react";
import type { RatingData } from "@/types";

interface Props {
  data: RatingData;
  selected?: boolean;
}

export const RatingNode = memo(({ data, selected }: Props) => {
  const ratingRange = Array.from(
    { length: data.maxValue - data.minValue + 1 },
    (_, i) => data.minValue + i
  );

  return (
    <div
      className={`bg-white rounded-lg shadow-md border-2 min-w-[280px] max-w-[320px] relative ${
        selected ? "border-purple-500 ring-2 ring-purple-200" : "border-gray-200"
      }`}
    >
      {/* Handle de entrada */}
      <Handle
        type="target"
        position={Position.Left}
        id="target"
        className="!w-4 !h-4 !bg-gray-400 !border-2 !border-white !-left-2"
      />

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-3 rounded-t-md">
        <div className="text-xs font-medium opacity-90 mb-1">Avaliação</div>
        <div className="font-semibold">{data.title || "Nova Avaliação"}</div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        {data.description && (
          <p className="text-sm text-gray-600">{data.description}</p>
        )}

        {/* Rating Range */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-1 py-2">
            {ratingRange.map((value) => (
              <div key={value} className="relative">
                <Star
                  className="w-6 h-6 text-yellow-400 fill-yellow-400"
                  strokeWidth={1.5}
                />
                <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-xs text-gray-500">
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Labels */}
          <div className="flex justify-between text-xs text-gray-500 mt-6">
            <span>{data.minLabel || `Min (${data.minValue})`}</span>
            <span>{data.maxLabel || `Max (${data.maxValue})`}</span>
          </div>
        </div>
      </div>

      {/* Handle de saída */}
      <Handle
        type="source"
        position={Position.Right}
        id="source"
        className="!w-4 !h-4 !bg-purple-500 !border-2 !border-white !-right-2"
      />
    </div>
  );
});

RatingNode.displayName = "RatingNode";
