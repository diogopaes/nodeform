"use client";

import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { PlayCircle, User, Mail } from "lucide-react";
import type { PresentationData } from "@/types";

interface Props {
  data: PresentationData;
  selected?: boolean;
}

export const PresentationNode = memo(({ data, selected }: Props) => {
  const hasDataCollection = data.collectName || data.collectEmail;

  return (
    <div
      className={`bg-white rounded-lg shadow-md border-2 min-w-[280px] max-w-[320px] relative ${
        selected ? "border-amber-500 ring-2 ring-amber-200" : "border-gray-200"
      }`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-3 rounded-t-md">
        <div className="flex items-center gap-2">
          <PlayCircle className="w-4 h-4 opacity-90" />
          <div className="text-xs font-medium opacity-90">Apresentação</div>
        </div>
        <div className="font-semibold mt-1">{data.title || "Tela de Início"}</div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-4">
        {data.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{data.description}</p>
        )}

        {/* Data Collection Preview */}
        {hasDataCollection && (
          <div className="space-y-2">
            {data.collectName && (
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-200">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">
                  {data.nameLabel || "Nome"}
                  {data.nameRequired && <span className="text-red-500 ml-1">*</span>}
                </span>
              </div>
            )}
            {data.collectEmail && (
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-200">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">
                  {data.emailLabel || "E-mail"}
                  {data.emailRequired && <span className="text-red-500 ml-1">*</span>}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Button Preview */}
        <div className="flex justify-center">
          <div className="px-6 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg">
            {data.buttonText || "Iniciar"}
          </div>
        </div>
      </div>

      {/* Handle de saída único */}
      <Handle
        type="source"
        position={Position.Right}
        id="source"
        className="!w-4 !h-4 !bg-amber-500 !border-2 !border-white !-right-2"
      />
    </div>
  );
});

PresentationNode.displayName = "PresentationNode";
