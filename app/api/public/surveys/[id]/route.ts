import { NextRequest, NextResponse } from "next/server";
import { getSurvey } from "@/lib/services/surveys";

// GET /api/public/surveys/[id] - Buscar pesquisa pública (sem autenticação)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const survey = await getSurvey(id);

    if (!survey) {
      return NextResponse.json(
        { error: "Pesquisa não encontrada" },
        { status: 404 }
      );
    }

    // Retornar apenas dados necessários para responder (sem userId)
    return NextResponse.json({
      survey: {
        id: survey.id,
        title: survey.title,
        description: survey.description,
        nodes: survey.nodes,
        edges: survey.edges,
        enableScoring: survey.enableScoring,
      },
    });
  } catch (error) {
    console.error("Error fetching public survey:", error);
    return NextResponse.json(
      { error: "Erro ao buscar pesquisa" },
      { status: 500 }
    );
  }
}
