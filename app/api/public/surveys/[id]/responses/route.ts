import { NextRequest, NextResponse } from "next/server";
import { saveResponse, getSurvey } from "@/lib/services/surveys";

// POST - Salvar resposta da pesquisa (público, não requer autenticação)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: surveyId } = await params;

    // Verificar se a pesquisa existe
    const survey = await getSurvey(surveyId);
    if (!survey) {
      return NextResponse.json(
        { error: "Pesquisa não encontrada" },
        { status: 404 }
      );
    }

    // Obter dados da resposta
    const body = await request.json();
    const { answers, totalScore, path, respondentName, respondentEmail } = body;

    // Validar dados obrigatórios
    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: "Dados de resposta inválidos" },
        { status: 400 }
      );
    }

    // Salvar resposta
    const response = await saveResponse(surveyId, {
      answers,
      totalScore: totalScore || 0,
      path: path || [],
      respondentName,
      respondentEmail,
    });

    return NextResponse.json({ response }, { status: 201 });
  } catch (error) {
    console.error("Error saving response:", error);
    return NextResponse.json(
      { error: "Erro ao salvar resposta" },
      { status: 500 }
    );
  }
}
