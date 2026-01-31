"use client";

import { useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  ConnectionMode,
  Panel,
  Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useEditorStore } from "@/lib/stores";
import { nodeTypes } from "./nodes";
import { NodeEditModal } from "./node-edit-modal";
import type { SurveyNode } from "@/types";

export function FlowCanvas() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useEditorStore();

  const [selectedNode, setSelectedNode] = useState<SurveyNode | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Configurar snap to grid
  const snapGrid: [number, number] = [20, 20];

  // Abrir modal ao dar duplo clique no nó
  const handleNodeDoubleClick = (_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node as unknown as SurveyNode);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDoubleClick={handleNodeDoubleClick}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Strict}
        snapToGrid={true}
        snapGrid={snapGrid}
        fitView
        attributionPosition="bottom-left"
        className="bg-gray-50"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#94a3b8"
        />
        <Controls
          showZoom
          showFitView
          showInteractive
          position="bottom-right"
        />
        <MiniMap
          nodeColor="#3b82f6"
          maskColor="rgb(0, 0, 0, 0.1)"
          position="bottom-left"
          className="bg-white border border-gray-200 rounded-lg"
        />
        <Panel position="top-left" className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4">
          <div className="space-y-1">
            <h2 className="font-semibold text-gray-900">Editor de Pesquisa</h2>
            <p className="text-xs text-gray-500">
              {nodes.length} {nodes.length === 1 ? "pergunta" : "perguntas"}
            </p>
          </div>
        </Panel>
      </ReactFlow>

      {/* Modal de edição */}
      {selectedNode && (
        <NodeEditModal
          node={selectedNode}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
