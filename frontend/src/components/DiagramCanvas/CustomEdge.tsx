/**
 * Custom edge component for displaying connections in React Flow.
 */

import { memo } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  getStraightPath,
  getSmoothStepPath,
  EdgeProps
} from 'reactflow';
import type { Connection } from '@/types/landscape';

interface CustomEdgeData {
  connection: Connection;
  lineStyle?: string;
  edgeType?: string;
  isRelated?: boolean;  // Flag for related edges
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
  selected,  // React Flow provides this prop
}: EdgeProps<CustomEdgeData>) {
  const lineStyle = data?.lineStyle || 'solid';
  const edgeType = data?.edgeType || 'default';
  const connection = data?.connection;
  const isRelated = data?.isRelated || false;

  // Get the appropriate path based on edge type
  let edgePath: string;
  let labelX: number;
  let labelY: number;

  const pathParams = {
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  };

  switch (edgeType) {
    case 'straight':
      [edgePath, labelX, labelY] = getStraightPath(pathParams);
      break;
    case 'step':
      [edgePath, labelX, labelY] = getSmoothStepPath({ ...pathParams, borderRadius: 0 });
      break;
    case 'smoothstep':
      [edgePath, labelX, labelY] = getSmoothStepPath({ ...pathParams, borderRadius: 16 });
      break;
    case 'bezier':
    case 'default':
    default:
      [edgePath, labelX, labelY] = getBezierPath(pathParams);
      break;
  }

  // Get stroke dash array based on line style
  const getStrokeDashArray = (style: string): string => {
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
  const strokeDasharray = getStrokeDashArray(lineStyle);

  // Calculate stroke width and opacity based on state
  const getStrokeWidth = () => {
    if (selected) return 4;  // Thicker when selected
    if (isRelated) return 3;  // Medium when related
    return 2;  // Default
  };

  const getStrokeOpacity = () => {
    if (selected) return 1;
    if (isRelated) return 0.7;
    return 0.6;
  };

  // Glow effect using filter
  const getEdgeFilter = () => {
    if (selected) {
      return 'drop-shadow(0 0 8px rgba(74, 144, 226, 0.8))';
    } else if (isRelated) {
      return 'drop-shadow(0 0 4px rgba(74, 144, 226, 0.4))';
    }
    return 'none';
  };

  return (
    <>
      {/* Glow layer (behind main path) - only shown when selected or related */}
      {(selected || isRelated) && (
        <path
          d={edgePath}
          fill="none"
          stroke={strokeColor}
          strokeWidth={getStrokeWidth() + 4}
          strokeOpacity={0.2}
          strokeDasharray={strokeDasharray}
          className="react-flow__edge-path-glow"
          style={{ filter: getEdgeFilter() }}
        />
      )}

      {/* Main path */}
      <path
        id={id}
        d={edgePath}
        fill="none"
        stroke={strokeColor}
        strokeWidth={getStrokeWidth()}
        strokeOpacity={getStrokeOpacity()}
        strokeDasharray={strokeDasharray}
        markerEnd={markerEnd}
        className="react-flow__edge-path"
        style={{
          transition: 'all 0.3s ease',
        }}
      />
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              background: '#ffffff',
              padding: selected ? '6px 10px' : '4px 8px',
              borderRadius: '4px',
              fontSize: selected ? '12px' : '11px',
              fontWeight: selected ? 600 : 500,
              color: '#2c3e50',
              border: selected ? '2px solid #4A90E2' : '1px solid #e0e0e0',
              boxShadow: selected
                ? '0 4px 8px rgba(0,0,0,0.15)'
                : isRelated
                ? '0 3px 6px rgba(0,0,0,0.12)'
                : '0 2px 4px rgba(0,0,0,0.1)',
              pointerEvents: 'all',
              maxWidth: '150px',
              textAlign: 'center',
              transition: 'all 0.3s ease',
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
