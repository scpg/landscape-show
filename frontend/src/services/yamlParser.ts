/**
 * YAML parsing utilities for the frontend.
 */

import * as yaml from 'js-yaml';
import type {
  Landscape,
  MergedLandscape,
  MergedSystem,
  SeparatedLandscape,
  SystemDefinition,
  SystemPosition,
  SystemStyle,
} from '@/types/landscape';

export class YAMLParser {
  private static isSeparatedLandscape(data: any): data is SeparatedLandscape {
    return Array.isArray(data?.systems) && (!!data['systems-positions'] || !!data['systems_positions']);
  }

  private static toMergedLandscape(data: SeparatedLandscape): MergedLandscape {
    const positions: Record<string, SystemPosition> = {};
    const styles: Record<string, SystemStyle> = {};

    (data['systems-positions'] ?? []).forEach((pos) => {
      positions[pos.id] = pos;
    });
    (data['systems-styles'] ?? []).forEach((style) => {
      styles[style.id] = style;
    });

    const mergedSystems: MergedSystem[] = (data.systems as SystemDefinition[]).map((system) => {
      const position = positions[system.id];
      if (!position) {
        throw new Error(`Missing position for system '${system.id}' in systems-positions`);
      }

      const style = styles[system.id];

      return {
        ...system,
        position: {
          x: position.x,
          y: position.y,
        },
        style: style
          ? {
              color: style.color,
              icon: style.icon,
              backgroundColor: style.backgroundColor,
              borderColor: style.borderColor,
            }
          : undefined,
      };
    });

    return {
      metadata: data.metadata,
      systems: mergedSystems,
      connections: data.connections ?? [],
      groups: data.groups ?? [],
    };
  }

  /**
   * Parse YAML string to Landscape object.
   */
  static parse(yamlContent: string): Landscape {
    try {
      const data = yaml.load(yamlContent) as any;
      if (!data) {
        throw new Error('YAML content is empty');
      }

      if (YAMLParser.isSeparatedLandscape(data)) {
        return YAMLParser.toMergedLandscape(data);
      }

      return data as MergedLandscape;
    } catch (error) {
      throw new Error(`YAML parsing error: ${error}`);
    }
  }

  /**
   * Serialize Landscape object to YAML string.
   */
  static stringify(landscape: Landscape): string {
    try {
      return yaml.dump(landscape, {
        indent: 2,
        lineWidth: 120,
        noRefs: true,
        sortKeys: false,
      });
    } catch (error) {
      throw new Error(`YAML serialization error: ${error}`);
    }
  }

  /**
   * Validate YAML syntax without full parsing.
   */
  static validate(yamlContent: string): { valid: boolean; error?: string } {
    try {
      YAMLParser.parse(yamlContent);
      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}
