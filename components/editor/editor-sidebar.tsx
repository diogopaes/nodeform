"use client";

import { CircleDot, CheckSquare, Star, PlayCircle } from "lucide-react";
import { useEditorStore } from "@/lib/stores";
import type { SurveyNode, PresentationData, SingleChoiceData, MultipleChoiceData, RatingData } from "@/types";

export function EditorSidebar() {
  const { addNode, nodes } = useEditorStore();

  const generateId = () => `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const handleAddPresentation = () => {
    const newNode: SurveyNode = {
      id: generateId(),
      type: "presentation",
      position: {
        x: 100 + nodes.length * 50,
        y: 100 + nodes.length * 50,
      },
      data: {
        type: "presentation",
        title: "Bem-vindo à Pesquisa",
        description: "Esta é uma pesquisa rápida que levará apenas alguns minutos.",
        buttonText: "Iniciar Pesquisa",
      } as PresentationData,
    };
    addNode(newNode);
  };

  const handleAddSingleChoice = () => {
    const newNode: SurveyNode = {
      id: generateId(),
      type: "singleChoice",
      position: {
        x: 100 + nodes.length * 50,
        y: 100 + nodes.length * 50,
      },
      data: {
        type: "singleChoice",
        title: "Nova Pergunta",
        description: "Escolha uma opção",
        options: [
          { id: "opt1", label: "Opção 1", score: 10 },
          { id: "opt2", label: "Opção 2", score: 20 },
          { id: "opt3", label: "Opção 3", score: 30 },
        ],
      } as SingleChoiceData,
    };
    addNode(newNode);
  };

  const handleAddMultipleChoice = () => {
    const newNode: SurveyNode = {
      id: generateId(),
      type: "multipleChoice",
      position: {
        x: 100 + nodes.length * 50,
        y: 100 + nodes.length * 50,
      },
      data: {
        type: "multipleChoice",
        title: "Nova Pergunta",
        description: "Selecione todas que se aplicam",
        options: [
          { id: "opt1", label: "Opção 1", score: 10 },
          { id: "opt2", label: "Opção 2", score: 10 },
          { id: "opt3", label: "Opção 3", score: 10 },
        ],
      } as MultipleChoiceData,
    };
    addNode(newNode);
  };

  const handleAddRating = () => {
    const newNode: SurveyNode = {
      id: generateId(),
      type: "rating",
      position: {
        x: 100 + nodes.length * 50,
        y: 100 + nodes.length * 50,
      },
      data: {
        type: "rating",
        title: "Nova Avaliação",
        description: "Avalie de 1 a 5",
        minValue: 1,
        maxValue: 5,
        minLabel: "Muito Insatisfeito",
        maxLabel: "Muito Satisfeito",
      } as RatingData,
    };
    addNode(newNode);
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Adicionar Pergunta</h3>
        <p className="text-xs text-gray-500 mt-1">
          Clique para adicionar ao canvas
        </p>
      </div>

      {/* Node Types */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {/* Presentation */}
        <button
          onClick={handleAddPresentation}
          className="w-full p-4 bg-gradient-to-br from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 border-2 border-amber-200 rounded-lg transition-all flex flex-col items-start gap-2 group"
        >
          <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <PlayCircle className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <div className="font-semibold text-gray-900 text-sm">
              Apresentação
            </div>
            <div className="text-xs text-gray-600 mt-1">
              Tela inicial com título e botão para iniciar
            </div>
          </div>
        </button>

        {/* Single Choice */}
        <button
          onClick={handleAddSingleChoice}
          className="w-full p-4 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border-2 border-blue-200 rounded-lg transition-all flex flex-col items-start gap-2 group"
        >
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <CircleDot className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <div className="font-semibold text-gray-900 text-sm">
              Escolha Simples
            </div>
            <div className="text-xs text-gray-600 mt-1">
              Uma única opção, cada opção conecta individualmente
            </div>
          </div>
        </button>

        {/* Multiple Choice */}
        <button
          onClick={handleAddMultipleChoice}
          className="w-full p-4 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border-2 border-green-200 rounded-lg transition-all flex flex-col items-start gap-2 group"
        >
          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <CheckSquare className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <div className="font-semibold text-gray-900 text-sm">
              Múltipla Escolha
            </div>
            <div className="text-xs text-gray-600 mt-1">
              Várias opções, conecta independente das respostas
            </div>
          </div>
        </button>

        {/* Rating */}
        <button
          onClick={handleAddRating}
          className="w-full p-4 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border-2 border-purple-200 rounded-lg transition-all flex flex-col items-start gap-2 group"
        >
          <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <Star className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <div className="font-semibold text-gray-900 text-sm">
              Avaliação
            </div>
            <div className="text-xs text-gray-600 mt-1">
              Avaliação com estrelas ou escala
            </div>
          </div>
        </button>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-600">
          <div className="font-medium mb-1">Dicas:</div>
          <ul className="space-y-1 list-disc list-inside">
            <li>Arraste os nós para organizar</li>
            <li>Conecte as opções às próximas perguntas</li>
            <li>Clique no nó para editar</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
