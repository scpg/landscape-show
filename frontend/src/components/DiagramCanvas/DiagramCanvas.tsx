/**
 * Main diagram canvas component using React Flow.
 */

import { useCallback, useMemo, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  BackgroundVariant,
  NodeTypes,
  EdgeTypes,
  OnSelectionChangeParams,
} from 'reactflow';
import 'reactflow/dist/style.css';

import CustomNode from './CustomNode';
import CustomEdge from './CustomEdge';
import type { Landscape } from '@/types/landscape';
import { landscapeToFlow } from '@/utils/yamlToFlow';
import { extractPositionUpdates } from '@/utils/flowToYaml';
import { useLandscapeStore } from '@/stores/landscapeStore';

interface DiagramCanvasProps {
  landscape: Landscape;
  onPositionChange?: (updates: Record<string, { x: number; y: number }>) => void;
}

// Register custom node and edge types
const nodeTypes: NodeTypes = {
  customSystem: CustomNode,
};

const edgeTypes: EdgeTypes = {
  customConnection: CustomEdge,
};

export default function DiagramCanvas({
  landscape,
  onPositionChange,
}: DiagramCanvasProps) {
  // Get highlight state and actions from store
  const { highlightState, setSelectedNodes, setSelectedEdges } = useLandscapeStore();

  // Convert landscape to React Flow format
  const initialFlow = useMemo(() => landscapeToFlow(landscape), [landscape]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialFlow.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialFlow.edges);

  // Handle selection changes from diagram
  const handleSelectionChange = useCallback(
    ({ nodes: selectedNodes, edges: selectedEdges }: OnSelectionChangeParams) => {
      // Only update if selection came from diagram interaction (not programmatic)
      if (highlightState.selectionSource !== 'yaml') {
        const nodeIds = selectedNodes.map(n => n.id);
        const edgeIds = selectedEdges.map(e => e.id);

        if (nodeIds.length > 0) {
          setSelectedNodes(nodeIds, 'diagram');
        } else if (edgeIds.length > 0) {
          setSelectedEdges(edgeIds, 'diagram');
        } else {
          // Clear selection
          setSelectedNodes([], 'diagram');
          setSelectedEdges([], 'diagram');
        }
      }
    },
    [highlightState.selectionSource, setSelectedNodes, setSelectedEdges]
  );

  // Handle programmatic selection from YAML cursor position
  useEffect(() => {
    if (highlightState.selectionSource === 'yaml' && highlightState.highlightedFromYaml.id) {
      if (highlightState.highlightedFromYaml.type === 'system') {
        // Select the system node
        const nodeId = highlightState.highlightedFromYaml.id;
        setNodes((nds) =>
          nds.map((n) => ({
            ...n,
            selected: n.id === nodeId,
          }))
        );
        // Clear edge selection
        setEdges((eds) =>
          eds.map((e) => ({
            ...e,
            selected: false,
          }))
        );
      } else if (highlightState.highlightedFromYaml.type === 'connection') {
        // Select the connection edge
        const edgeId = highlightState.highlightedFromYaml.id;
        setEdges((eds) =>
          eds.map((e) => ({
            ...e,
            selected: e.id === edgeId,
          }))
        );
        // Clear node selection
        setNodes((nds) =>
          nds.map((n) => ({
            ...n,
            selected: false,
          }))
        );
      }
    } else if (highlightState.selectionSource === 'yaml' && !highlightState.highlightedFromYaml.id) {
      // Clear all selections when cursor is in non-element area
      setNodes((nds) =>
        nds.map((n) => ({
          ...n,
          selected: false,
        }))
      );
      setEdges((eds) =>
        eds.map((e) => ({
          ...e,
          selected: false,
        }))
      );
    }
  }, [highlightState.highlightedFromYaml, highlightState.selectionSource, setNodes, setEdges]);

  // Pass highlight state to nodes/edges via data prop
  const nodesWithHighlight = useMemo(() => {
    return nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        isRelated:
          highlightState.selectedNodeIds.length > 0 &&
          !highlightState.selectedNodeIds.includes(node.id) &&
          highlightState.relatedEdgeIds.some(
            (edgeId) => edgeId.startsWith(node.id + '-') || edgeId.endsWith('-' + node.id)
          ),
      },
    }));
  }, [nodes, highlightState.selectedNodeIds, highlightState.relatedEdgeIds]);

  const edgesWithHighlight = useMemo(() => {
    return edges.map((edge) => ({
      ...edge,
      data: {
        ...edge.data,
        isRelated:
          highlightState.relatedEdgeIds.includes(edge.id) &&
          !highlightState.selectedEdgeIds.includes(edge.id),
      },
    }));
  }, [edges, highlightState.relatedEdgeIds, highlightState.selectedEdgeIds]);

  // Handle node drag stop - update positions
  const handleNodeDragStop = useCallback(() => {
    if (onPositionChange) {
      const updates = extractPositionUpdates(nodes);
      onPositionChange(updates);
    }
  }, [nodes, onPositionChange]);

  // Handle edge connections (if users draw new connections in the future)
  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge(connection, eds));
    },
    [setEdges]
  );

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodesWithHighlight}
        edges={edgesWithHighlight}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDragStop={handleNodeDragStop}
        onSelectionChange={handleSelectionChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        minZoom={0.2}
        maxZoom={2}
        defaultEdgeOptions={{
          animated: false,
          style: { strokeWidth: 2 },
        }}
      >
        <Controls />
        <MiniMap
          nodeStrokeColor={(node) => {
            return node.data.color || '#4A90E2';
          }}
          nodeColor={(node) => {
            return node.data.color || '#4A90E2';
          }}
          nodeBorderRadius={8}
        />
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
      </ReactFlow>
    </div>
  );
}
