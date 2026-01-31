"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X, ArrowLeft } from "lucide-react";
import { QuestionRenderer } from "@/components/survey/question-renderer";
import { useEditorStore } from "@/lib/stores/editor-store";
import { useRuntimeStore } from "@/lib/stores/runtime-store";
import { Button } from "@/components/ui/button";

export default function SurveyPage() {
  const router = useRouter();
  const { getSurvey } = useEditorStore();
  const {
    survey,
    currentNodeId,
    isCompleted,
    totalScore,
    startSurvey,
    answerNode,
    getCurrentNode,
    resetSurvey,
    goBack,
    canGoBack,
  } = useRuntimeStore();

  const [isLoading, setIsLoading] = useState(true);

  const handleExitSurvey = () => {
    if (confirm("Deseja sair do teste? O progresso será perdido.")) {
      resetSurvey();
      router.push("/editor");
    }
  };

  useEffect(() => {
    // Carregar pesquisa do editor
    const editorSurvey = getSurvey();

    if (!editorSurvey || editorSurvey.nodes.length === 0) {
      alert("Nenhuma pesquisa encontrada! Crie uma pesquisa primeiro.");
      router.push("/editor");
      return;
    }

    // Garantir que enableScoring está definido
    if (editorSurvey.enableScoring === undefined) {
      editorSurvey.enableScoring = true;
    }

    startSurvey(editorSurvey);
    setIsLoading(false);
  }, []);

  // Redirecionar para resultados quando completar
  useEffect(() => {
    if (isCompleted) {
      router.push("/survey/result");
    }
  }, [isCompleted, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-600">Carregando pesquisa...</p>
        </div>
      </div>
    );
  }

  if (!survey || !currentNodeId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center space-y-4">
          <p className="text-gray-600">Erro ao carregar pesquisa</p>
          <button
            onClick={() => router.push("/editor")}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Voltar ao Editor
          </button>
        </div>
      </div>
    );
  }

  const currentNode = getCurrentNode();

  if (!currentNode) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Nó não encontrado</p>
      </div>
    );
  }

  const handleAnswer = (answer: { selectedOptionId?: string; selectedOptionIds?: string[]; ratingValue?: number }) => {
    answerNode({
      nodeId: currentNodeId,
      ...answer,
      answeredAt: new Date(),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Exit Button */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          onClick={handleExitSurvey}
          variant="outline"
          size="sm"
          className="bg-white shadow-md hover:bg-gray-50"
        >
          <X className="w-4 h-4 mr-2" />
          Sair do Teste
        </Button>
      </div>

      <div className="py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">{survey.title}</h1>
            {survey.description && (
              <p className="text-gray-600">{survey.description}</p>
            )}
          </div>

          {/* Question */}
          <QuestionRenderer node={currentNode} onAnswer={handleAnswer} />

          {/* Back Button */}
          {canGoBack() && (
            <div className="flex justify-center">
              <Button
                onClick={goBack}
                variant="outline"
                size="sm"
                className="bg-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar à Pergunta Anterior
              </Button>
            </div>
          )}

          {/* Progress */}
          {survey?.enableScoring && (
            <div className="text-center text-sm text-gray-500">
              <p>Pontuação atual: {totalScore} pontos</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
