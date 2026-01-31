"use client";

import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { CheckSquare } from "lucide-react";
import type { MultipleChoiceData } from "@/types";

interface Props {
  data: MultipleChoiceData;
  selected?: boolean;
}

export const MultipleChoiceNode = memo(({ data, selected }: Props) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-md border-2 min-w-[280px] max-w-[320px] relative ${
        selected ? "border-green-500 ring-2 ring-green-200" : "border-gray-200"
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
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-t-md">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-4 h-4" />
          <div className="flex-1">
            <div className="text-xs font-medium opacity-90">Múltipla Escolha</div>
            <div className="font-semibold text-sm">{data.title || "Nova Pergunta"}</div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        {data.description && (
          <p className="text-sm text-gray-600">{data.description}</p>
        )}

        {/* Options with checkboxes */}
        <div className="space-y-2">
          {data.options.map((option) => (
            <div
              key={option.id}
              className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-200"
            >
              <div className="w-4 h-4 rounded border-2 border-green-500 flex-shrink-0" />
              <span className="text-sm text-gray-700 flex-1">{option.label}</span>
              {option.score !== undefined && option.score > 0 && (
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                  +{option.score}
                </span>
              )}
            </div>
          ))}
        </div>

        {data.options.length === 0 && (
          <p className="text-xs text-gray-400 italic text-center py-2">
            Nenhuma opção adicionada
          </p>
        )}

        {/* Info sobre conexão */}
        <div className="text-xs text-gray-500 bg-green-50 border border-green-200 rounded p-2">
          Conecta à próxima pergunta independente das respostas
        </div>
      </div>

      {/* Handle de saída único */}
      <Handle
        type="source"
        position={Position.Right}
        id="source"
        className="!w-4 !h-4 !bg-green-500 !border-2 !border-white !-right-2"
      />
    </div>
  );
});

MultipleChoiceNode.displayName = "MultipleChoiceNode";
