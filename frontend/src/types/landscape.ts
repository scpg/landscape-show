/**
 * TypeScript types for landscape data structures.
 * These mirror the backend Pydantic models.
 */

export enum SystemType {
  CUSTOMER_FACING = 'customer-facing',
  BACKEND = 'backend',
  DATABASE = 'database',
  EXTERNAL = 'external',
  INTEGRATION = 'integration',
  ANALYTICS = 'analytics',
}

export enum ConnectionType {
  API = 'api',
  DATABASE = 'database',
  FILE_TRANSFER = 'file-transfer',
  MESSAGE_QUEUE = 'message-queue',
  MANUAL = 'manual',
  EVENT = 'event',
}

export enum LineStyle {
  SOLID = 'solid',
  DASHED = 'dashed',
  DOTTED = 'dotted',
}

export enum EdgeType {
  DEFAULT = 'default',
  STRAIGHT = 'straight',
  STEP = 'step',
  SMOOTHSTEP = 'smoothstep',
  BEZIER = 'bezier',
}

export interface Position {
  x: number;
  y: number;
}

export interface Style {
  color?: string;
  icon?: string;
  backgroundColor?: string;
  borderColor?: string;
  lineStyle?: LineStyle;
  edgeType?: EdgeType;
  animated?: boolean;
}

export interface Metadata {
  title: string;
  description?: string;
  version: string;
  last_updated?: string;
  author?: string;
}

export interface System {
  id: string;
  name: string;
  type: SystemType;
  description?: string;
  owner?: string;
  technology?: string;
  position: Position;
  style?: Style;
}

export interface Connection {
  from: string;
  to: string;
  label?: string;
  type: ConnectionType;
  description?: string;
  style?: Style;
}

export interface Group {
  id: string;
  name: string;
  systems: string[];
  style?: Style;
}

export interface Landscape {
  metadata: Metadata;
  systems: System[];
  connections: Connection[];
  groups?: Group[];
}

export interface LandscapeListItem {
  id: string;
  title: string;
  description?: string;
  version: string;
  last_updated?: string;
  file_path: string;
}

export interface LandscapeResponse {
  id: string;
  yaml: string;
  parsed: Landscape;
}

export interface PositionUpdate {
  x: number;
  y: number;
}

export interface PositionUpdates {
  updates: Record<string, PositionUpdate>;
}
