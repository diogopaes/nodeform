"use client";

import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { useEditorStore } from "@/lib/stores";
import type { SingleChoiceData } from "@/types";

interface Props {
  data: SingleChoiceData;
  selected?: boolean;
}

export const SingleChoiceNode = memo(({ data, selected }: Props) => {
  const enableScoring = useEditorStore((state) => state.enableScoring);
  return (
    <div
      className={`bg-white rounded-lg shadow-md border-2 min-w-[280px] max-w-[320px] relative ${
        selected ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200"
      }`}
    >
      {/* Handle de entrada - posicionado no container principal */}
      <Handle
        type="target"
        position={Position.Left}
        id="target"
        className="!w-4 !h-4 !bg-gray-400 !border-2 !border-white !-left-2"
      />

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-t-md">
        <div className="text-xs font-medium opacity-90 mb-1">Escolha Simples</div>
        <div className="font-semibold">{data.title || "Nova Pergunta"}</div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        {data.description && (
          <p className="text-sm text-gray-600">{data.description}</p>
        )}

        {/* Options */}
        <div className="space-y-2">
          {data.options.map((option, index) => (
            <div
              key={option.id}
              className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-200 pr-6"
            >
              <div className="w-4 h-4 rounded-full border-2 border-blue-500 flex-shrink-0" />
              <span className="text-sm text-gray-700 flex-1">{option.label}</span>
              {enableScoring && option.score !== undefined && option.score > 0 && (
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
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
      </div>

      {/* Handles de saída para cada opção - posicionados absolutamente */}
      {data.options.map((option, index) => (
        <Handle
          key={option.id}
          type="source"
          position={Position.Right}
          id={option.id}
          className="!w-4 !h-4 !bg-blue-500 !border-2 !border-white !-right-2"
          style={{
            top: `${132 + index * 44}px`,
          }}
        />
      ))}
    </div>
  );
});

SingleChoiceNode.displayName = "SingleChoiceNode";
