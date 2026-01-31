"use client";

import { useEffect, useState, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import {
  Play,
  ArrowLeft,
  Trash2,
  Save,
  Loader2,
  Check,
} from "lucide-react";
import { FlowCanvas } from "@/components/editor/flow-canvas";
import { EditorSidebar } from "@/components/editor/editor-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEditorStore } from "@/lib/stores";
import { Survey } from "@/types/survey";

export default function EditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);

  const {
    nodes,
    edges,
    surveyId,
    surveyTitle,
    enableScoring,
    setEnableScoring,
    setSurveyTitle,
    loadSurvey,
    clearSurvey,
  } = useEditorStore();

  useEffect(() => {
    fetchSurvey();
  }, [id]);

  const fetchSurvey = async () => {
    try {
      const res = await fetch(`/api/surveys/${id}`);
      if (!res.ok) {
        router.push("/dashboard");
        return;
      }
      const data = await res.json();
      loadSurvey(data.survey as Survey);
    } catch (error) {
      console.error("Error fetching survey:", error);
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = useCallback(async () => {
    setSaving(true);
    setSaved(false);
    try {
      await fetch(`/api/surveys/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: surveyTitle,
          nodes,
          edges,
          enableScoring,
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error("Error saving survey:", error);
    } finally {
      setSaving(false);
    }
  }, [id, surveyTitle, nodes, edges, enableScoring]);

  const handleTestSurvey = () => {
    if (nodes.length === 0) {
      alert("Adicione pelo menos uma pergunta antes de testar!");
      return;
    }
    // Salvar antes de testar
    handleSave();
    window.open(`/survey/${id}`, "_blank");
  };

  const handleClearSurvey = () => {
    if (
      confirm(
        "Tem certeza que deseja limpar toda a pesquisa? Esta ação não pode ser desfeita."
      )
    ) {
      clearSurvey();
      // Recarregar os dados do título original
      useEditorStore.setState({ surveyId: id });
    }
  };

  const handleTitleSubmit = () => {
    setEditingTitle(false);
    handleSave();
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          Carregando editor...
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col">
      {/* Header */}
      <header className="h-16 border-b bg-white flex items-center justify-between px-6 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard")}
            className="text-slate-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
          <span className="text-slate-300">|</span>
          {editingTitle ? (
            <Input
              value={surveyTitle}
              onChange={(e) => setSurveyTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => e.key === "Enter" && handleTitleSubmit()}
              className="w-64 h-8"
              autoFocus
            />
          ) : (
            <button
              onClick={() => setEditingTitle(true)}
              className="text-lg font-semibold text-slate-900 hover:text-slate-600 transition-colors"
            >
              {surveyTitle}
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Toggle de Pontuação */}
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-sm text-slate-600">Pontuação:</span>
            <button
              onClick={() => setEnableScoring(!enableScoring)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                enableScoring ? "bg-green-600" : "bg-slate-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  enableScoring ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className="text-xs text-slate-500">
              {enableScoring ? "Ativa" : "Desativada"}
            </span>
          </label>

          <div className="h-6 w-px bg-slate-300" />

          <Button
            variant="outline"
            size="sm"
            onClick={handleClearSurvey}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Limpar
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : saved ? (
              <Check className="w-4 h-4 mr-2 text-green-600" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {saved ? "Salvo!" : "Salvar"}
          </Button>

          <Button
            size="sm"
            onClick={handleTestSurvey}
            className="bg-green-600 hover:bg-green-700"
          >
            <Play className="w-4 h-4 mr-2" />
            Testar
          </Button>
        </div>
      </header>

      {/* Main Editor Area */}
      <main className="flex-1 flex overflow-hidden">
        <EditorSidebar />
        <div className="flex-1">
          <FlowCanvas />
        </div>
      </main>
    </div>
  );
}
