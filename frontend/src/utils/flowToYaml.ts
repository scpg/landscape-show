/**
 * Convert React Flow data back to YAML Landscape format.
 */

import type { Node } from 'reactflow';
import type { Landscape, PositionUpdate } from '@/types/landscape';

/**
 * Extract position updates from React Flow nodes.
 * Returns a map of system ID to position.
 */
export function extractPositionUpdates(nodes: Node[]): Record<string, PositionUpdate> {
  const updates: Record<string, PositionUpdate> = {};

  nodes.forEach((node) => {
    updates[node.id] = {
      x: node.position.x,
      y: node.position.y,
    };
  });

  return updates;
}

/**
 * Update positions in a Landscape object based on React Flow nodes.
 */
export function updateLandscapePositions(
  landscape: Landscape,
  nodes: Node[]
): Landscape {
  const positionMap = new Map(
    nodes.map((node) => [node.id, node.position])
  );

  const updatedSystems = landscape.systems.map((system) => {
    const newPosition = positionMap.get(system.id);
    if (newPosition) {
      return {
        ...system,
        position: {
          x: newPosition.x,
          y: newPosition.y,
        },
      };
    }
    return system;
  });

  return {
    ...landscape,
    systems: updatedSystems,
  };
}
