/**
 * YAML Line Mapper Utility
 *
 * Maps YAML line numbers to landscape elements (systems/connections).
 * This enables bidirectional highlighting between YAML editor and diagram canvas.
 */

import * as yaml from 'js-yaml';
import type { Landscape } from '@/types/landscape';

export interface YamlLineRange {
  start: number;
  end: number;
}

export interface ElementMapping {
  type: 'system' | 'connection' | 'metadata' | 'group' | null;
  id: string | null;  // System ID or connection ID (from-to format)
  lineRange: YamlLineRange;
}

/**
 * YAML Line Mapper class for mapping line numbers to landscape elements.
 */
export class YamlLineMapper {
  private static lineMap: Map<number, ElementMapping> = new Map();
  private static lastYamlHash: string = '';

  /**
   * Generate a simple hash of YAML content for caching.
   */
  private static hashContent(content: string): string {
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
  }

  /**
   * Parse YAML and build line-to-element mapping.
   * Uses caching to avoid unnecessary re-parsing.
   */
  static buildLineMap(yamlContent: string): void {
    // Check cache
    const contentHash = this.hashContent(yamlContent);
    if (contentHash === this.lastYamlHash && this.lineMap.size > 0) {
      console.log('[YamlLineMapper] Using cached line map, size:', this.lineMap.size);
      return; // Use cached map
    }

    console.log('[YamlLineMapper] Building new line map from YAML content');
    this.lineMap.clear();
    this.lastYamlHash = contentHash;

    try {
      // Parse YAML to get structure
      const parsed = yaml.load(yamlContent) as Landscape;
      if (!parsed || typeof parsed !== 'object') {
        return;
      }

      // Split content into lines for analysis
      const lines = yamlContent.split('\n');

      // Track current context
      let currentSection: 'metadata' | 'systems' | 'connections' | 'groups' | null = null;
      let currentSystemId: string | null = null;
      let currentConnectionFrom: string | null = null;
      let currentConnectionTo: string | null = null;
      let systemStartLine: number = -1;
      let connectionStartLine: number = -1;

      lines.forEach((line, index) => {
        const lineNum = index + 1; // 1-indexed for Monaco Editor
        const trimmed = line.trim();
        const indent = line.length - line.trimStart().length;

        // Skip empty lines and comments
        if (trimmed === '' || trimmed.startsWith('#')) {
          return;
        }

        // Detect top-level section headers (indent === 0)
        if (indent === 0) {
          if (trimmed.startsWith('metadata:')) {
            // Close previous section
            if (currentSection === 'systems' && currentSystemId && systemStartLine > 0) {
              this.markLineRange(systemStartLine, lineNum - 1, 'system', currentSystemId);
            } else if (currentSection === 'connections' && connectionStartLine > 0 && currentConnectionFrom && currentConnectionTo) {
              const connId = `${currentConnectionFrom}-${currentConnectionTo}`;
              this.markLineRange(connectionStartLine, lineNum - 1, 'connection', connId);
            }

            currentSection = 'metadata';
            currentSystemId = null;
            currentConnectionFrom = null;
            currentConnectionTo = null;
            return;
          } else if (trimmed.startsWith('systems:')) {
            currentSection = 'systems';
            currentSystemId = null;
            return;
          } else if (trimmed.startsWith('connections:')) {
            // Close previous system if any
            if (currentSystemId && systemStartLine > 0) {
              this.markLineRange(systemStartLine, lineNum - 1, 'system', currentSystemId);
            }

            currentSection = 'connections';
            currentSystemId = null;
            currentConnectionFrom = null;
            currentConnectionTo = null;
            return;
          } else if (trimmed.startsWith('groups:')) {
            // Close previous connection if any
            if (connectionStartLine > 0 && currentConnectionFrom && currentConnectionTo) {
              const connId = `${currentConnectionFrom}-${currentConnectionTo}`;
              this.markLineRange(connectionStartLine, lineNum - 1, 'connection', connId);
            }

            currentSection = 'groups';
            currentConnectionFrom = null;
            currentConnectionTo = null;
            return;
          }
        }

        // Detect system entries (indent === 0 or 2, starting with '- id:')
        if (currentSection === 'systems' && (indent === 0 || indent === 2) && trimmed.startsWith('- id:')) {
          // Mark end of previous system
          if (currentSystemId && systemStartLine > 0) {
            this.markLineRange(systemStartLine, lineNum - 1, 'system', currentSystemId);
          }

          // Extract system ID
          const match = trimmed.match(/^- id:\s*(.+)/);
          if (match) {
            currentSystemId = match[1].trim();
            systemStartLine = lineNum;
            console.log(`[YamlLineMapper] Found system: ${currentSystemId} at line ${lineNum}`);
          }
          return;
        }

        // Detect connection entries (indent === 0 or 2)
        if (currentSection === 'connections' && (indent === 0 || indent === 2)) {
          if (trimmed.startsWith('- from:')) {
            // Mark end of previous connection
            if (connectionStartLine > 0 && currentConnectionFrom && currentConnectionTo) {
              const connId = `${currentConnectionFrom}-${currentConnectionTo}`;
              this.markLineRange(connectionStartLine, lineNum - 1, 'connection', connId);
            }

            // Extract 'from' system ID
            const match = trimmed.match(/^- from:\s*(.+)/);
            if (match) {
              currentConnectionFrom = match[1].trim();
              currentConnectionTo = null;
              connectionStartLine = lineNum;
            }
            return;
          } else if (trimmed.startsWith('to:')) {
            // Extract 'to' system ID
            const match = trimmed.match(/^to:\s*(.+)/);
            if (match) {
              currentConnectionTo = match[1].trim();
            }
            return;
          }
        }
      });

      // Mark final system/connection
      if (currentSection === 'systems' && currentSystemId && systemStartLine > 0) {
        this.markLineRange(systemStartLine, lines.length, 'system', currentSystemId);
      } else if (currentSection === 'connections' && connectionStartLine > 0 && currentConnectionFrom && currentConnectionTo) {
        const connId = `${currentConnectionFrom}-${currentConnectionTo}`;
        this.markLineRange(connectionStartLine, lines.length, 'connection', connId);
      }

      console.log('[YamlLineMapper] Built line map with', this.lineMap.size, 'line mappings');

      // Debug: Show what systems were found
      const systems = new Set<string>();
      this.lineMap.forEach((mapping) => {
        if (mapping.type === 'system' && mapping.id) {
          systems.add(mapping.id);
        }
      });
      console.log('[YamlLineMapper] Found systems:', Array.from(systems));

    } catch (error) {
      console.warn('Failed to build YAML line map:', error);
      // Leave map empty - no highlighting on error
    }
  }

  /**
   * Mark a range of lines as belonging to an element.
   */
  private static markLineRange(
    start: number,
    end: number,
    type: 'system' | 'connection' | 'metadata' | 'group',
    id: string
  ): void {
    for (let line = start; line <= end; line++) {
      this.lineMap.set(line, {
        type,
        id,
        lineRange: { start, end },
      });
    }
  }

  /**
   * Get the element at a specific line number.
   * Automatically builds the line map if needed.
   */
  static getElementAtLine(
    yamlContent: string,
    line: number
  ): { type: 'system' | 'connection' | null; id: string | null } {
    // Build/update map
    this.buildLineMap(yamlContent);

    const mapping = this.lineMap.get(line);
    if (!mapping || !mapping.type || mapping.type === 'metadata' || mapping.type === 'group') {
      return { type: null, id: null };
    }

    return {
      type: mapping.type,
      id: mapping.id,
    };
  }

  /**
   * Get line range for a specific element ID.
   * Returns null if element not found.
   */
  static getLineRangeForElement(
    yamlContent: string,
    type: 'system' | 'connection',
    id: string
  ): YamlLineRange | null {
    // Build/update map
    this.buildLineMap(yamlContent);

    // Find first occurrence of this element
    for (const [line, mapping] of this.lineMap.entries()) {
      if (mapping.type === type && mapping.id === id) {
        return mapping.lineRange;
      }
    }

    return null;
  }

  /**
   * Clear the cached line map (useful for testing or forcing rebuild).
   */
  static clearCache(): void {
    this.lineMap.clear();
    this.lastYamlHash = '';
  }
}
