/**
 * YAML parsing utilities for the frontend.
 */

import * as yaml from 'js-yaml';
import type { Landscape } from '@/types/landscape';

export class YAMLParser {
  /**
   * Parse YAML string to Landscape object.
   */
  static parse(yamlContent: string): Landscape {
    try {
      const data = yaml.load(yamlContent) as Landscape;
      return data;
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
      yaml.load(yamlContent);
      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}
