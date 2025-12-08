import { describe, expect, it } from 'vitest';
import { YAMLParser } from '../src/services/yamlParser';

const separatedYaml = `
metadata:
  title: Company System Landscape (New Format)
  description: Overview of all company systems and their interconnections
  version: '1.1'
  author: System Architecture Team

systems:
  - id: crm-system
    name: CRM System
    type: customer-facing
    description: Customer relationship management platform
    owner: Sales Team
    technology: Salesforce

systems-positions:
  - id: crm-system
    x: 100
    y: 100

systems-styles:
  - id: crm-system
    color: '#4A90E2'
    icon: users

connections:
  - from: crm-system
    to: billing-system
    type: api
    style:
      edgeType: default
      lineStyle: solid
      animated: false
`;

const mergedYaml = `
metadata:
  title: Legacy Format
  version: '1.0'
systems:
  - id: legacy
    name: Legacy
    type: backend
    position:
      x: 1
      y: 2
connections: []
`;

describe('YAMLParser', () => {
  it('merges separated schema into a usable Landscape', () => {
    const parsed = YAMLParser.parse(separatedYaml);
    expect(parsed.metadata.title).toBe('Company System Landscape (New Format)');
    expect(parsed.systems).toHaveLength(1);
    const system = parsed.systems[0];
    expect(system.id).toBe('crm-system');
    expect(system.position).toEqual({ x: 100, y: 100 });
    expect(system.style?.color).toBe('#4A90E2');
    expect(parsed.connections[0].style?.edgeType).toBe('default');
  });

  it('throws if a system definition is missing a position', () => {
    const badYaml = separatedYaml.replace(/systems-positions:[\\s\\S]*?\\n\\n/, '');
    expect(() => YAMLParser.parse(badYaml)).toThrow(/Missing position for system 'crm-system'/);
  });

  it('still accepts merged/legacy inline format for compatibility', () => {
    const parsed = YAMLParser.parse(mergedYaml);
    expect(parsed.systems[0].position).toEqual({ x: 1, y: 2 });
  });
});
