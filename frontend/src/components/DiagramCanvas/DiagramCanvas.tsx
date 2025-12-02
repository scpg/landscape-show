/**
 * Main diagram canvas component using React Flow.
 */

import { useCallback, useMemo } from 'react';
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
} from 'reactflow';
import 'reactflow/dist/style.css';

import CustomNode from './CustomNode';
import CustomEdge from './CustomEdge';
import type { Landscape } from '@/types/landscape';
import { landscapeToFlow } from '@/utils/yamlToFlow';
import { extractPositionUpdates } from '@/utils/flowToYaml';

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
  // Convert landscape to React Flow format
  const initialFlow = useMemo(() => landscapeToFlow(landscape), [landscape]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialFlow.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialFlow.edges);

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
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDragStop={handleNodeDragStop}
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
