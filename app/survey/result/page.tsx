"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trophy, Star, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRuntimeStore } from "@/lib/stores/runtime-store";

export default function ResultPage() {
  const router = useRouter();
  const { survey, totalScore, answers, isCompleted, resetSurvey, getResult } =
    useRuntimeStore();

  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!isCompleted) {
      router.push("/survey");
      return;
    }

    // Mostrar confetti quando carregar
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  }, [isCompleted, router]);

  if (!survey || !isCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-gray-600">Carregando resultado...</p>
        </div>
      </div>
    );
  }

  const result = getResult();

  // Determinar mensagem baseada na pontuação (ou sem pontuação)
  const getResultMessage = (score: number, enableScoring?: boolean) => {
    // Se scoring está desativado, mostrar mensagem genérica
    if (!enableScoring) {
      return {
        title: "Concluído!",
        message: "Obrigado por completar a pesquisa.",
        icon: Star,
        color: "text-blue-500",
        bgColor: "bg-blue-50",
      };
    }

    // Com scoring ativo, mostrar mensagem baseada na pontuação
    if (score >= 100) {
      return {
        title: "Excelente!",
        message: "Você teve uma pontuação incrível!",
        icon: Trophy,
        color: "text-yellow-500",
        bgColor: "bg-yellow-50",
      };
    } else if (score >= 50) {
      return {
        title: "Muito Bom!",
        message: "Você teve um bom desempenho.",
        icon: Star,
        color: "text-blue-500",
        bgColor: "bg-blue-50",
      };
    } else {
      return {
        title: "Obrigado!",
        message: "Obrigado por completar a pesquisa.",
        icon: Star,
        color: "text-purple-500",
        bgColor: "bg-purple-50",
      };
    }
  };

  const resultData = getResultMessage(totalScore, survey?.enableScoring ?? true);
  const ResultIcon = resultData.icon;

  const handleRestart = () => {
    resetSurvey();
    router.push("/survey");
  };

  const handleGoHome = () => {
    resetSurvey();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4 relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-3xl mx-auto space-y-8 relative z-10">
        {/* Result Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 space-y-8">
          {/* Icon */}
          <div className={`w-24 h-24 ${resultData.bgColor} rounded-full flex items-center justify-center mx-auto`}>
            <ResultIcon className={`w-12 h-12 ${resultData.color}`} />
          </div>

          {/* Title */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">
              {resultData.title}
            </h1>
            <p className="text-xl text-gray-600">{resultData.message}</p>
          </div>

          {/* Score */}
          {(survey?.enableScoring ?? true) && (
            <div className="text-center py-8 border-y border-gray-200">
              <div className="space-y-2">
                <p className="text-sm text-gray-500 uppercase tracking-wide">
                  Pontuação Final
                </p>
                <p className="text-6xl font-bold text-gray-900">{totalScore}</p>
                <p className="text-sm text-gray-500">pontos</p>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 py-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {result?.answers.length || 0}
              </p>
              <p className="text-sm text-gray-500">Perguntas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {result?.path.length || 0}
              </p>
              <p className="text-sm text-gray-500">Passos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">100%</p>
              <p className="text-sm text-gray-500">Completo</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6">
            <Button
              onClick={handleRestart}
              variant="outline"
              className="flex-1 h-12"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Responder Novamente
            </Button>
            <Button onClick={handleGoHome} className="flex-1 h-12">
              <Home className="w-4 h-4 mr-2" />
              Voltar ao Início
            </Button>
          </div>
        </div>

        {/* Survey Info */}
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">Pesquisa: {survey.title}</p>
          <p className="text-xs text-gray-400">
            Criado com NodeForm - Visual Survey Builder
          </p>
        </div>
      </div>
    </div>
  );
}
