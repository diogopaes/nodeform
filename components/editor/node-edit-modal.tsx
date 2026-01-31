"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, GripVertical, User, Mail, Trophy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { useEditorStore } from "@/lib/stores";
import type { SurveyNode, NodeData } from "@/types";

interface NodeEditModalProps {
  node: SurveyNode;
  isOpen: boolean;
  onClose: () => void;
}

// Schema base para todos os tipos
const baseSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
});

// Schema para presentation
const presentationSchema = baseSchema.extend({
  type: z.literal("presentation"),
  buttonText: z.string().min(1, "Texto do botão é obrigatório"),
  collectName: z.boolean().optional(),
  collectEmail: z.boolean().optional(),
  nameLabel: z.string().optional(),
  emailLabel: z.string().optional(),
  nameRequired: z.boolean().optional(),
  emailRequired: z.boolean().optional(),
});

// Schema para opções
const optionSchema = z.object({
  id: z.string(),
  label: z.string().min(1, "Label é obrigatório"),
  score: z.number().optional(),
});

// Schema para single/multiple choice
const choiceSchema = baseSchema.extend({
  type: z.enum(["singleChoice", "multipleChoice"]),
  options: z.array(optionSchema).min(1, "Adicione pelo menos uma opção"),
});

// Schema para rating
const ratingSchema = baseSchema.extend({
  type: z.literal("rating"),
  minValue: z.number().min(0),
  maxValue: z.number().min(1),
  minLabel: z.string().optional(),
  maxLabel: z.string().optional(),
});

type FormData = z.infer<typeof presentationSchema> | z.infer<typeof choiceSchema> | z.infer<typeof ratingSchema>;

const getTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    presentation: "Apresentação",
    singleChoice: "Escolha Simples",
    multipleChoice: "Múltipla Escolha",
    rating: "Avaliação",
  };
  return labels[type] || type;
};

const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    presentation: "bg-amber-500",
    singleChoice: "bg-blue-500",
    multipleChoice: "bg-green-500",
    rating: "bg-purple-500",
  };
  return colors[type] || "bg-gray-500";
};

export function NodeEditModal({ node, isOpen, onClose }: NodeEditModalProps) {
  const { updateNode, deleteNode, enableScoring } = useEditorStore();

  const getDefaultValues = (): FormData => {
    const { type } = node.data;

    if (type === "presentation") {
      const presData = node.data as {
        buttonText?: string;
        collectName?: boolean;
        collectEmail?: boolean;
        nameLabel?: string;
        emailLabel?: string;
        nameRequired?: boolean;
        emailRequired?: boolean;
      };
      return {
        type: "presentation",
        title: node.data.title,
        description: node.data.description || "",
        buttonText: presData.buttonText || "Iniciar",
        collectName: presData.collectName || false,
        collectEmail: presData.collectEmail || false,
        nameLabel: presData.nameLabel || "Nome",
        emailLabel: presData.emailLabel || "E-mail",
        nameRequired: presData.nameRequired || false,
        emailRequired: presData.emailRequired || false,
      };
    }

    if (type === "singleChoice" || type === "multipleChoice") {
      return {
        type,
        title: node.data.title,
        description: node.data.description || "",
        options: (node.data as { options: Array<{ id: string; label: string; score?: number }> }).options,
      };
    }

    if (type === "rating") {
      const ratingData = node.data as { minValue: number; maxValue: number; minLabel?: string; maxLabel?: string };
      return {
        type: "rating",
        title: node.data.title,
        description: node.data.description || "",
        minValue: ratingData.minValue,
        maxValue: ratingData.maxValue,
        minLabel: ratingData.minLabel || "",
        maxLabel: ratingData.maxLabel || "",
      };
    }

    return {
      type: "presentation",
      title: "",
      description: "",
      buttonText: "Iniciar",
    };
  };

  const form = useForm<FormData>({
    resolver: zodResolver(
      node.data.type === "presentation"
        ? presentationSchema
        : node.data.type === "rating"
        ? ratingSchema
        : choiceSchema
    ),
    defaultValues: getDefaultValues(),
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "options" as never,
  });

  useEffect(() => {
    if (isOpen) {
      form.reset(getDefaultValues());
    }
  }, [isOpen, node]);

  const onSubmit = (data: FormData) => {
    updateNode(node.id, data as Partial<NodeData>);
    onClose();
  };

  const handleDelete = () => {
    if (confirm("Tem certeza que deseja deletar esta pergunta?")) {
      deleteNode(node.id);
      onClose();
    }
  };

  const addOption = () => {
    append({
      id: `opt_${Date.now()}`,
      label: `Opção ${fields.length + 1}`,
      score: 0,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${getTypeColor(node.data.type)}`} />
            <DialogTitle className="text-xl">
              Editar {getTypeLabel(node.data.type)}
            </DialogTitle>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto px-1 space-y-6 py-4">
              {/* Título */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite o título..."
                        className="text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Descrição */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Digite uma descrição opcional..."
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Campos específicos por tipo */}
              {node.data.type === "presentation" && (
                <>
                  <FormField
                    control={form.control}
                    name="buttonText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Texto do Botão</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: Iniciar Pesquisa"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <div className="space-y-4">
                    <FormLabel className="text-base">Captura de Dados</FormLabel>
                    <p className="text-sm text-slate-500">
                      Colete informações do respondente antes de iniciar a pesquisa.
                    </p>

                    {/* Coletar Nome */}
                    <div className="p-4 bg-slate-50 rounded-lg border space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <User className="w-5 h-5 text-slate-500" />
                          <div>
                            <p className="font-medium text-slate-900">Coletar Nome</p>
                            <p className="text-sm text-slate-500">Solicitar o nome do respondente</p>
                          </div>
                        </div>
                        <FormField
                          control={form.control}
                          name="collectName"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      {form.watch("collectName") && (
                        <div className="grid grid-cols-2 gap-4 pt-2">
                          <FormField
                            control={form.control}
                            name="nameLabel"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm">Label do campo</FormLabel>
                                <FormControl>
                                  <Input placeholder="Nome" {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="nameRequired"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-between pt-8">
                                <FormLabel className="text-sm">Obrigatório</FormLabel>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                    </div>

                    {/* Coletar Email */}
                    <div className="p-4 bg-slate-50 rounded-lg border space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-slate-500" />
                          <div>
                            <p className="font-medium text-slate-900">Coletar E-mail</p>
                            <p className="text-sm text-slate-500">Solicitar o e-mail do respondente</p>
                          </div>
                        </div>
                        <FormField
                          control={form.control}
                          name="collectEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      {form.watch("collectEmail") && (
                        <div className="grid grid-cols-2 gap-4 pt-2">
                          <FormField
                            control={form.control}
                            name="emailLabel"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm">Label do campo</FormLabel>
                                <FormControl>
                                  <Input placeholder="E-mail" {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="emailRequired"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-between pt-8">
                                <FormLabel className="text-sm">Obrigatório</FormLabel>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {(node.data.type === "singleChoice" || node.data.type === "multipleChoice") && (
                <div className="space-y-4">
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <FormLabel className="text-base">Opções de Resposta</FormLabel>
                      <p className="text-sm text-slate-500 mt-1">
                        {node.data.type === "singleChoice"
                          ? "O usuário poderá escolher apenas uma opção"
                          : "O usuário poderá escolher múltiplas opções"}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addOption}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Adicionar
                    </Button>
                  </div>

                  {enableScoring && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <Trophy className="w-4 h-4 text-green-600" />
                      <p className="text-sm text-green-700">
                        Pontuação ativa: defina pontos para cada opção
                      </p>
                    </div>
                  )}

                  <div className="space-y-3">
                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border"
                      >
                        <GripVertical className="w-4 h-4 text-slate-400 cursor-grab" />

                        <FormField
                          control={form.control}
                          name={`options.${index}.label`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input
                                  placeholder="Texto da opção"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        {enableScoring && (
                          <FormField
                            control={form.control}
                            name={`options.${index}.score`}
                            render={({ field }) => (
                              <FormItem className="w-24">
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="Pontos"
                                    className="text-center"
                                    {...field}
                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        )}

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                          className="text-slate-400 hover:text-red-500"
                          disabled={fields.length <= 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {node.data.type === "rating" && (
                <div className="space-y-4">
                  <Separator />
                  <div>
                    <FormLabel className="text-base">Configuração da Escala</FormLabel>
                    <p className="text-sm text-slate-500 mt-1">
                      Defina o intervalo de valores para a avaliação
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="minValue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm text-slate-500">Valor Mínimo</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="maxValue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm text-slate-500">Valor Máximo</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="minLabel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm text-slate-500">Label Mínimo</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: Muito Insatisfeito"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="maxLabel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm text-slate-500">Label Máximo</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: Muito Satisfeito"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  {enableScoring && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-3">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-green-600" />
                        <p className="text-sm font-medium text-green-700">
                          Pontuação Ativa
                        </p>
                      </div>
                      <p className="text-sm text-green-600">
                        O valor selecionado pelo usuário será usado como pontuação.
                        Ex: Se escolher 4 em uma escala de 1-5, ganha 4 pontos.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <Separator className="my-4" />

            <DialogFooter className="flex-row justify-between sm:justify-between">
              <Button
                type="button"
                variant="ghost"
                onClick={handleDelete}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir
              </Button>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Salvar
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
