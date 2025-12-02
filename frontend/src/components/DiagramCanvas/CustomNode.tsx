/**
 * Custom node component for displaying systems in React Flow.
 */

import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { System } from '@/types/landscape';

interface CustomNodeProps {
  data: {
    label: string;
    system: System;
    color: string;
  };
  selected?: boolean;
}

function CustomNode({ data, selected }: CustomNodeProps) {
  const { label, system, color } = data;

  return (
    <div
      style={{
        padding: '15px 20px',
        borderRadius: '8px',
        backgroundColor: '#ffffff',
        border: `3px solid ${color}`,
        boxShadow: selected
          ? `0 0 0 2px ${color}40, 0 4px 12px rgba(0,0,0,0.15)`
          : '0 2px 8px rgba(0,0,0,0.1)',
        minWidth: '180px',
        transition: 'all 0.2s ease',
        cursor: 'grab',
      }}
    >
      {/* Connection handles */}
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: color,
          width: '10px',
          height: '10px',
          border: '2px solid white',
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: color,
          width: '10px',
          height: '10px',
          border: '2px solid white',
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: color,
          width: '10px',
          height: '10px',
          border: '2px solid white',
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: color,
          width: '10px',
          height: '10px',
          border: '2px solid white',
        }}
      />

      {/* Node content */}
      <div>
        <div
          style={{
            fontWeight: 600,
            fontSize: '14px',
            marginBottom: '6px',
            color: '#2c3e50',
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: '11px',
            color: '#7f8c8d',
            marginBottom: '4px',
            textTransform: 'capitalize',
          }}
        >
          {system.type.replace('-', ' ')}
        </div>
        {system.owner && (
          <div
            style={{
              fontSize: '10px',
              color: '#95a5a6',
              fontStyle: 'italic',
            }}
          >
            {system.owner}
          </div>
        )}
        {system.technology && (
          <div
            style={{
              fontSize: '10px',
              color: '#95a5a6',
              marginTop: '4px',
              padding: '2px 6px',
              backgroundColor: '#f8f9fa',
              borderRadius: '3px',
              display: 'inline-block',
            }}
          >
            {system.technology}
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(CustomNode);
