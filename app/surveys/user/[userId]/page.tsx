"use client";

import { useEffect, useState, use } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FileText, Loader2, Clock, Gift } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PublicSurvey {
  id: string;
  title: string;
  description?: string;
  responseCount: number;
  timeLimit?: number;
  prize?: string;
  updatedAt: string;
}

export default function UserSurveysPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = use(params);
  const searchParams = useSearchParams();
  const isEmbedMode = searchParams.get("embed") === "true";

  const [surveys, setSurveys] = useState<PublicSurvey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSurveys();
  }, [userId]);

  const fetchSurveys = async () => {
    try {
      const res = await fetch(`/api/public/users/${userId}/surveys`);
      if (!res.ok) {
        setError("Não foi possível carregar as pesquisas");
        return;
      }
      const data = await res.json();
      setSurveys(data.surveys || []);
    } catch (err) {
      console.error("Error fetching surveys:", err);
      setError("Erro ao carregar pesquisas");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 ${isEmbedMode ? "p-4" : "p-8"}`}>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 ${isEmbedMode ? "p-4" : "p-8"}`}>
        <div className="text-center py-12">
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 ${isEmbedMode ? "p-10" : "p-8"}`}>
      <div className={`mx-auto ${isEmbedMode ? "max-w-full" : "max-w-4xl"}`}>
        {!isEmbedMode && (
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Pesquisas Disponíveis</h1>
            <p className="text-gray-600">Selecione uma pesquisa para participar</p>
          </div>
        )}

        {surveys.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">Nenhuma pesquisa disponível no momento</p>
          </div>
        ) : (
          <div className={`grid gap-4 ${isEmbedMode ? "grid-cols-2 max-w-3xl mx-auto" : "md:grid-cols-4"}`}>
            {surveys.map((survey) => (
              <Card key={survey.id} className="bg-white hover:shadow-lg transition-shadow border-0 shadow-md rounded-xl overflow-hidden">
                <CardContent className="p-6">
                  {/* Título */}
                  <h3 className="font-bold text-primary text-lg mb-2 leading-tight">
                    {survey.title}
                  </h3>

                  {/* Descrição */}
                  {survey.description && (
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                      {survey.description}
                    </p>
                  )}

                  {/* Informações */}
                  <div className="space-y-2 mb-4">
                    {survey.timeLimit && (
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>Estimativa de Tempo: <strong>{survey.timeLimit} minutos</strong></span>
                      </p>
                    )}
                    {survey.prize && (
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <Gift className="w-4 h-4 text-gray-400" />
                        <span>Remuneração: <strong>{survey.prize}</strong></span>
                      </p>
                    )}
                  </div>

                  {/* Botão */}
                  <Link
                    href={`/survey/${survey.id}${isEmbedMode ? "?embed=true" : ""}`}
                    target={isEmbedMode ? "_blank" : undefined}
                  >
                    <Button className="bg-primary hover:bg-blue-700 text-white rounded-lg px-6">
                      Participar
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isEmbedMode && (
          <div className="text-center mt-8">
            <p className="text-xs text-gray-400">
              Criado com NodeForm
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
