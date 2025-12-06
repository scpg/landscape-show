/**
 * Convert YAML Landscape data to React Flow format.
 */

import type { Node, Edge } from 'reactflow';
import type { Landscape, System, Connection, SystemType } from '@/types/landscape';

// Color mapping for system types
const SYSTEM_TYPE_COLORS: Record<SystemType, string> = {
  'customer-facing': '#4A90E2',
  'backend': '#F39C12',
  'database': '#336791',
  'external': '#6772E5',
  'integration': '#27AE60',
  'analytics': '#8E44AD',
};

/**
 * Convert a System to a React Flow Node.
 */
function systemToNode(system: System): Node {
  const color = system.style?.color || SYSTEM_TYPE_COLORS[system.type];

  return {
    id: system.id,
    type: 'customSystem',
    position: {
      x: system.position.x,
      y: system.position.y,
    },
    data: {
      label: system.name,
      system: system,
      color: color,
    },
  };
}

/**
 * Convert a Connection to a React Flow Edge.
 */
function connectionToEdge(connection: Connection): Edge {
  return {
    id: `${connection.from}-${connection.to}`,
    source: connection.from,
    target: connection.to,
    type: 'customConnection',
    label: connection.label,
    animated: connection.style?.animated || false,
    data: {
      connection: connection,
      lineStyle: connection.style?.lineStyle || 'solid',
      edgeType: connection.style?.edgeType || 'default',
    },
  };
}

/**
 * Convert a complete Landscape to React Flow nodes and edges.
 */
export function landscapeToFlow(landscape: Landscape): {
  nodes: Node[];
  edges: Edge[];
} {
  const nodes = landscape.systems.map(systemToNode);
  const edges = landscape.connections.map(connectionToEdge);

  return { nodes, edges };
}

/**
 * Get the color for a system type.
 */
export function getSystemTypeColor(type: SystemType): string {
  return SYSTEM_TYPE_COLORS[type];
}
