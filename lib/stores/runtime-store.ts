import { create } from "zustand";
import type { Survey, RuntimeState, NodeAnswer, SurveyResult } from "@/types";

interface RuntimeStoreState extends RuntimeState {
  // Survey sendo executada
  survey: Survey | null;

  // Actions
  startSurvey: (survey: Survey) => void;
  answerNode: (answer: NodeAnswer) => void;
  goToNode: (nodeId: string) => void;
  goBack: () => void;
  completeSurvey: () => void;
  resetSurvey: () => void;

  // Helpers
  getCurrentNode: () => ReturnType<Survey["nodes"]["find"]> | undefined;
  getNextNodeId: (currentNodeId: string, answer: NodeAnswer) => string | null;
  getResult: () => SurveyResult | null;
  canGoBack: () => boolean;
}

export const useRuntimeStore = create<RuntimeStoreState>((set, get) => ({
  // Estado inicial
  survey: null,
  currentNodeId: null,
  answers: [],
  totalScore: 0,
  visitedNodeIds: [],
  isCompleted: false,

  // Iniciar pesquisa
  startSurvey: (survey) => {
    // Encontrar o primeiro nó (nó que não tem nenhuma edge apontando para ele)
    const targetNodeIds = new Set(survey.edges.map((edge) => edge.target));
    const firstNode = survey.nodes.find((node) => !targetNodeIds.has(node.id)) || survey.nodes[0];

    set({
      survey,
      currentNodeId: firstNode?.id || null,
      answers: [],
      totalScore: 0,
      visitedNodeIds: firstNode ? [firstNode.id] : [],
      isCompleted: false,
    });
  },

  // Responder nó atual
  answerNode: (answer) => {
    const state = get();
    const newAnswers = [...state.answers, answer];

    // Calcular score apenas se enableScoring estiver ativo
    let scoreToAdd = 0;
    if (state.survey?.enableScoring) {
      // Para singleChoice
      if (answer.selectedOptionId && state.survey) {
        const node = state.survey.nodes.find((n) => n.id === answer.nodeId);
        if (node && (node.data.type === "singleChoice" || node.data.type === "multipleChoice")) {
          const option = node.data.options.find((o) => o.id === answer.selectedOptionId);
          scoreToAdd = option?.score || 0;
        }
      }

      // Para multiple choice (múltiplas seleções)
      if (answer.selectedOptionIds && state.survey) {
        const node = state.survey.nodes.find((n) => n.id === answer.nodeId);
        if (node && node.data.type === "multipleChoice") {
          const multipleChoiceNode = node as { data: { type: "multipleChoice"; options: Array<{ id: string; score?: number }> } };
          answer.selectedOptionIds.forEach((optId) => {
            const option = multipleChoiceNode.data.options.find((o) => o.id === optId);
            if (option?.score) {
              scoreToAdd += option.score;
            }
          });
        }
      }

      // Para rating
      if (answer.ratingValue !== undefined && state.survey?.enableScoring) {
        scoreToAdd = answer.ratingValue;
      }
    }

    set({
      answers: newAnswers,
      totalScore: state.totalScore + scoreToAdd,
    });

    // Determinar próximo nó
    const nextNodeId = get().getNextNodeId(answer.nodeId, answer);

    if (nextNodeId) {
      get().goToNode(nextNodeId);
    } else {
      get().completeSurvey();
    }
  },

  // Navegar para um nó específico
  goToNode: (nodeId) => {
    set((state) => ({
      currentNodeId: nodeId,
      visitedNodeIds: [...state.visitedNodeIds, nodeId],
    }));
  },

  // Voltar para o nó anterior
  goBack: () => {
    const state = get();

    // Não pode voltar se estiver no primeiro nó ou se não houver histórico
    if (state.visitedNodeIds.length <= 1 || state.answers.length === 0) {
      return;
    }

    // Obter última resposta para recalcular score
    const lastAnswer = state.answers[state.answers.length - 1];
    let scoreToRemove = 0;

    if (state.survey?.enableScoring) {
      // Calcular score da última resposta para remover
      if (lastAnswer.selectedOptionId && state.survey) {
        const node = state.survey.nodes.find((n) => n.id === lastAnswer.nodeId);
        if (node && (node.data.type === "singleChoice" || node.data.type === "multipleChoice")) {
          const option = node.data.options?.find((o: { id: string }) => o.id === lastAnswer.selectedOptionId);
          scoreToRemove = (option as { score?: number })?.score || 0;
        }
      }

      if (lastAnswer.selectedOptionIds && state.survey) {
        const node = state.survey.nodes.find((n) => n.id === lastAnswer.nodeId);
        if (node && node.data.type === "multipleChoice") {
          const multipleChoiceNode = node as { data: { type: "multipleChoice"; options: Array<{ id: string; score?: number }> } };
          lastAnswer.selectedOptionIds.forEach((optId) => {
            const option = multipleChoiceNode.data.options.find((o) => o.id === optId);
            if (option?.score) {
              scoreToRemove += option.score;
            }
          });
        }
      }

      if (lastAnswer.ratingValue !== undefined) {
        scoreToRemove = lastAnswer.ratingValue;
      }
    }

    // Remover último nó do histórico e última resposta
    const newVisitedNodeIds = state.visitedNodeIds.slice(0, -1);
    const previousNodeId = newVisitedNodeIds[newVisitedNodeIds.length - 1];
    const newAnswers = state.answers.slice(0, -1);

    set({
      currentNodeId: previousNodeId,
      visitedNodeIds: newVisitedNodeIds,
      answers: newAnswers,
      totalScore: state.totalScore - scoreToRemove,
    });
  },

  // Completar pesquisa
  completeSurvey: () => {
    set({ isCompleted: true, currentNodeId: null });
  },

  // Resetar pesquisa
  resetSurvey: () => {
    set({
      survey: null,
      currentNodeId: null,
      answers: [],
      totalScore: 0,
      visitedNodeIds: [],
      isCompleted: false,
    });
  },

  // Obter nó atual
  getCurrentNode: () => {
    const state = get();
    if (!state.survey || !state.currentNodeId) return undefined;
    return state.survey.nodes.find((node) => node.id === state.currentNodeId);
  },

  // Determinar próximo nó baseado na resposta
  getNextNodeId: (currentNodeId, answer) => {
    const state = get();
    if (!state.survey) return null;

    console.log("=== getNextNodeId ===");
    console.log("currentNodeId:", currentNodeId);
    console.log("answer:", answer);
    console.log("available edges:", state.survey.edges.filter(e => e.source === currentNodeId));

    // Obter todas as edges do nó atual
    const availableEdges = state.survey.edges.filter(e => e.source === currentNodeId);

    // Se não há edges, completar pesquisa
    if (availableEdges.length === 0) {
      console.log("No edges found, completing survey");
      return null;
    }

    // Encontrar edge que corresponde à resposta
    let matchingEdge = availableEdges.find((edge) => {
      // Para presentation: usar primeira edge disponível (conexão padrão)
      const isEmptyAnswer = !answer.selectedOptionId && !answer.selectedOptionIds && answer.ratingValue === undefined;
      if (isEmptyAnswer) {
        console.log("Found presentation/default edge");
        return true;
      }

      // Para singleChoice: verificar se o optionId bate
      if (answer.selectedOptionId && edge.data?.optionId) {
        console.log("Checking singleChoice edge:", edge.data.optionId, "vs", answer.selectedOptionId);
        return edge.data.optionId === answer.selectedOptionId;
      }

      // Para multipleChoice: buscar edge sem optionId (conexão padrão)
      if (answer.selectedOptionIds && !edge.data?.optionId && !edge.data?.ratingValue) {
        console.log("Found multipleChoice default edge");
        return true;
      }

      // Para rating: verificar se o valor bate ou buscar conexão padrão
      if (answer.ratingValue !== undefined) {
        if (edge.data?.ratingValue !== undefined) {
          return edge.data.ratingValue === answer.ratingValue;
        }
        // Se não tem ratingValue específico, aceita como conexão padrão
        if (!edge.data?.optionId && !edge.data?.ratingValue) {
          return true;
        }
      }

      return false;
    });

    // Se não encontrou edge específica, usar a primeira disponível (fallback para dados antigos)
    if (!matchingEdge && availableEdges.length > 0) {
      console.log("No specific edge found, using first available edge as fallback");
      matchingEdge = availableEdges[0];
    }

    console.log("matchingEdge:", matchingEdge);
    return matchingEdge?.target || null;
  },

  // Obter resultado final
  getResult: () => {
    const state = get();
    if (!state.survey || !state.isCompleted) return null;

    return {
      surveyId: state.survey.id,
      answers: state.answers,
      totalScore: state.totalScore,
      completedAt: new Date(),
      path: state.visitedNodeIds,
    };
  },

  // Verificar se pode voltar
  canGoBack: () => {
    const state = get();
    return state.visitedNodeIds.length > 1 && state.answers.length > 0;
  },
}));
