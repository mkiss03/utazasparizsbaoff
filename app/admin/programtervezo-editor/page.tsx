'use client'

import {
  addEdge,
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  type Connection,
  type Edge,
  type Node,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { loadFlow, saveFlow } from '@/lib/actions/flows'
import { createDefaultNodeData, type FlowGraph, type FlowNodeData, type NodeType } from '@/lib/planner/flow-types'
import { mockDestinationId } from '@/lib/planner/mock-catalog'
import FlowNodeCard from './_components/FlowNodeCard'
import FlowRuntime from './_components/FlowRuntime'
import NodePalette from './_components/NodePalette'
import PropertyPanel from './_components/PropertyPanel'
import { buildSeedFlow } from './seedFlow'

const nodeTypes = { flowNode: FlowNodeCard }

type RFNode = Node<FlowNodeData & Record<string, unknown>>

function graphToReactFlow(graph: FlowGraph): { nodes: RFNode[]; edges: Edge[] } {
  return {
    nodes: graph.nodes.map(
      (n) => ({ id: n.id, type: 'flowNode', position: n.position, data: n.data }) as RFNode
    ),
    edges: graph.edges.map((e) => ({ id: e.id, source: e.source, target: e.target, sourceHandle: e.sourceHandle })),
  }
}

function reactFlowToGraph(nodes: RFNode[], edges: Edge[]): FlowGraph {
  return {
    nodes: nodes.map((n) => ({
      id: n.id,
      type: n.data.kind as NodeType,
      position: n.position,
      data: n.data,
    })),
    edges: edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      sourceHandle: e.sourceHandle ?? undefined,
    })),
  }
}

function EditorInner() {
  const [nodes, setNodes, onNodesChange] = useNodesState<RFNode>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    let cancelled = false

    // Ha a mentett flow betöltése bármiért elhasal (pl. a planner Supabase
    // projekt vagy a flows tábla még nincs bekötve/lefuttatva), az editor a
    // beépített seed flow-val induljon el üres kézzel várakozás helyett.
    loadFlow(mockDestinationId)
      .then((result) => {
        if (cancelled) return
        if (result.error) setSaveMessage(`Betöltési figyelmeztetés: ${result.error} -- a mostani flow az alapértelmezett.`)
        const graph = result.graph && result.graph.nodes.length > 0 ? result.graph : buildSeedFlow()
        const { nodes: rfNodes, edges: rfEdges } = graphToReactFlow(graph)
        setNodes(rfNodes)
        setEdges(rfEdges)
        setIsLoading(false)
      })
      .catch((error) => {
        if (cancelled) return
        setSaveMessage(
          `Betöltési hiba (${error instanceof Error ? error.message : 'ismeretlen'}) -- a mostani flow az alapértelmezett.`
        )
        const graph = buildSeedFlow()
        const { nodes: rfNodes, edges: rfEdges } = graphToReactFlow(graph)
        setNodes(rfNodes)
        setEdges(rfEdges)
        setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  )

  const addNode = useCallback(
    (type: NodeType) => {
      const id = `node-${Date.now()}`
      const lastNode = nodes[nodes.length - 1]
      const position = lastNode
        ? { x: lastNode.position.x + 340, y: lastNode.position.y }
        : { x: 0, y: 0 }
      setNodes((current) => [
        ...current,
        { id, type: 'flowNode', position, data: createDefaultNodeData(type) } as RFNode,
      ])
      setSelectedNodeId(id)
    },
    [nodes, setNodes]
  )

  const updateSelectedNodeData = useCallback(
    (data: FlowNodeData) => {
      if (!selectedNodeId) return
      setNodes((current) =>
        current.map((n) => (n.id === selectedNodeId ? ({ ...n, data } as RFNode) : n))
      )
    },
    [selectedNodeId, setNodes]
  )

  const deleteSelectedNode = useCallback(() => {
    if (!selectedNodeId) return
    setNodes((current) => current.filter((n) => n.id !== selectedNodeId))
    setEdges((current) => current.filter((e) => e.source !== selectedNodeId && e.target !== selectedNodeId))
    setSelectedNodeId(null)
  }, [selectedNodeId, setNodes, setEdges])

  const handleSave = useCallback(async () => {
    setIsSaving(true)
    setSaveMessage(null)
    const graph = reactFlowToGraph(nodes, edges)
    const result = await saveFlow(mockDestinationId, graph)
    setIsSaving(false)
    setSaveMessage(result.success ? 'Mentve.' : `Hiba: ${result.error}`)
  }, [nodes, edges])

  const currentGraph = useMemo(() => reactFlowToGraph(nodes, edges), [nodes, edges])
  const selectedNode = nodes.find((n) => n.id === selectedNodeId)

  if (isLoading) {
    return <div className="p-8 font-montserrat text-parisian-grey-500">Betöltés...</div>
  }

  return (
    <div className="flex h-[calc(100vh-140px)] flex-col overflow-hidden rounded-2xl border border-parisian-beige-200">
      <div className="flex items-center justify-between border-b border-parisian-beige-200 bg-white px-4 py-3">
        <div>
          <h1 className="font-playfair text-xl font-bold text-parisian-grey-800">Programtervező -- flow-szerkesztő</h1>
          <p className="font-montserrat text-xs text-parisian-grey-500">
            Kártyák és összeköttetések -- ugyanaz a mechanika, mint egy automatizáló eszközben.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saveMessage && <span className="font-montserrat text-xs text-parisian-grey-500">{saveMessage}</span>}
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="rounded-full border-2 border-parisian-beige-300 px-5 py-2 font-montserrat text-sm font-semibold text-parisian-grey-700 hover:border-parisian-beige-400"
          >
            Élő előnézet
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-full bg-parisian-beige-400 px-5 py-2 font-montserrat text-sm font-semibold text-white hover:bg-parisian-beige-500 disabled:opacity-50"
          >
            {isSaving ? 'Mentés...' : 'Mentés'}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <NodePalette onAdd={addNode} />

        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={(_, n) => setSelectedNodeId(n.id)}
            onPaneClick={() => setSelectedNodeId(null)}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background />
            <Controls />
            <MiniMap pannable zoomable />
          </ReactFlow>
        </div>

        {selectedNode && (
          <PropertyPanel
            node={{ id: selectedNode.id, type: selectedNode.data.kind as NodeType, position: selectedNode.position, data: selectedNode.data }}
            onChange={updateSelectedNodeData}
            onDelete={deleteSelectedNode}
            onClose={() => setSelectedNodeId(null)}
          />
        )}
      </div>

      {showPreview && (
        <div className="fixed inset-0 z-50 bg-white">
          <FlowRuntime graph={currentGraph} onExit={() => setShowPreview(false)} />
        </div>
      )}
    </div>
  )
}

export default function ProgramtervezoEditorPage() {
  return (
    <ReactFlowProvider>
      <EditorInner />
    </ReactFlowProvider>
  )
}
