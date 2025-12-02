/**
 * Custom edge component for displaying connections in React Flow.
 */

import { memo } from 'react';
import { BaseEdge, EdgeLabelRenderer, getBezierPath, EdgeProps } from 'reactflow';
import type { Connection, LineStyle } from '@/types/landscape';

interface CustomEdgeData {
  connection: Connection;
  lineStyle: LineStyle;
}

function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  label,
  data,
  markerEnd,
}: EdgeProps<CustomEdgeData>) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const lineStyle = data?.lineStyle || 'solid';
  const connection = data?.connection;

  // Get stroke dash array based on line style
  const getStrokeDashArray = (style: LineStyle): string => {
    switch (style) {
      case 'dashed':
        return '8, 4';
      case 'dotted':
        return '2, 2';
      case 'solid':
      default:
        return '0';
    }
  };

  const strokeColor = connection?.style?.color || '#b1b1b7';

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: strokeColor,
          strokeWidth: 2,
          strokeDasharray: getStrokeDashArray(lineStyle),
        }}
      />
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              background: '#ffffff',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: 500,
              color: '#2c3e50',
              border: '1px solid #e0e0e0',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              pointerEvents: 'all',
              maxWidth: '150px',
              textAlign: 'center',
            }}
            className="nodrag nopan"
          >
            {label}
            {connection?.type && (
              <div
                style={{
                  fontSize: '9px',
                  color: '#95a5a6',
                  marginTop: '2px',
                  textTransform: 'uppercase',
                }}
              >
                {connection.type}
              </div>
            )}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

export default memo(CustomEdge);
