/**
 * YAML Editor component using Monaco Editor.
 * Provides syntax highlighting, validation, auto-completion, and bidirectional highlighting.
 */

import { useRef, useEffect } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import { YAMLParser } from '@/services/yamlParser';
import { YamlLineMapper } from '@/utils/yamlLineMapper';
import { useLandscapeStore } from '@/stores/landscapeStore';

// Helper to convert color to pastel (lighter, more transparent)
function colorToPastel(hexColor: string | undefined, opacity: number = 0.2): string {
  if (!hexColor) return `rgba(74, 144, 226, ${opacity})`; // Default blue

  // Remove # if present
  const hex = hexColor.replace('#', '');

  // Parse RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

interface YamlEditorProps {
  value: string;
  onChange: (value: string) => void;
  onValidation?: (errors: string[]) => void;
  height?: string;
  readOnly?: boolean;
}

export default function YamlEditor({
  value,
  onChange,
  onValidation,
  height = '100%',
  readOnly = false,
}: YamlEditorProps) {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof monaco | null>(null);
  const decorationsRef = useRef<string[]>([]);  // Track decoration IDs for cleanup

  // Get highlight state and actions from store
  const { highlightState, setCursorLine, currentLandscape } = useLandscapeStore();

  const handleEditorDidMount: OnMount = (editor, monacoInstance) => {
    editorRef.current = editor;
    monacoRef.current = monacoInstance;

    // Listen to cursor position changes
    editor.onDidChangeCursorPosition((e) => {
      const line = e.position.lineNumber;
      console.log('[YamlEditor] Cursor moved to line:', line);
      setCursorLine(line);
    });
  };

  const handleEditorChange = (value: string | undefined) => {
    const newValue = value || '';
    onChange(newValue);

    // Rebuild line map when content changes
    console.log('[YamlEditor] Rebuilding line map, YAML length:', newValue.length);
    YamlLineMapper.buildLineMap(newValue);

    // Validate YAML
    if (onValidation) {
      const { valid, error } = YAMLParser.validate(newValue);
      if (!valid && error) {
        onValidation([error]);
      } else {
        onValidation([]);
      }
    }
  };

  // Apply Monaco decorations when diagram selection changes
  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) return;

    console.log('[YamlEditor] Applying decorations for selection:', {
      selectedNodeIds: highlightState.selectedNodeIds,
      selectedEdgeIds: highlightState.selectedEdgeIds,
      relatedEdgeIds: highlightState.relatedEdgeIds
    });

    const editor = editorRef.current;
    const monacoInstance = monacoRef.current;

    // Clear previous decorations
    decorationsRef.current = editor.deltaDecorations(decorationsRef.current, []);

    const newDecorations: monaco.editor.IModelDeltaDecoration[] = [];

    // Highlight element under cursor (from YAML → Diagram interaction)
    if (highlightState.highlightedFromYaml.id && currentLandscape) {
      const elementType = highlightState.highlightedFromYaml.type === 'system' ? 'system' : 'connection';
      const lineRange = YamlLineMapper.getLineRangeForElement(
        value,
        elementType,
        highlightState.highlightedFromYaml.id
      );

      if (lineRange) {
        // Get element color
        let elementColor: string | undefined;
        if (elementType === 'system') {
          const system = currentLandscape.systems.find(s => s.id === highlightState.highlightedFromYaml.id);
          elementColor = system?.style?.color;
        } else {
          const connection = currentLandscape.connections.find(c =>
            `${c.from}-${c.to}` === highlightState.highlightedFromYaml.id
          );
          elementColor = connection?.style?.color;
        }

        const pastelColor = colorToPastel(elementColor, 0.25);

        console.log(`[YamlEditor] Highlighting cursor element: ${highlightState.highlightedFromYaml.id} (lines ${lineRange.start}-${lineRange.end}) with color ${pastelColor}`);
        newDecorations.push({
          range: new monacoInstance.Range(lineRange.start, 1, lineRange.end, 1),
          options: {
            isWholeLine: true,
            inlineClassName: 'yaml-custom-highlight',
            className: 'yaml-custom-highlight',
          },
        });

        // Apply inline styles dynamically
        const model = editor.getModel();
        if (model) {
          for (let i = lineRange.start; i <= lineRange.end; i++) {
            const decoration = editor.deltaDecorations([], [{
              range: new monacoInstance.Range(i, 1, i, model.getLineMaxColumn(i)),
              options: {
                isWholeLine: true,
                inlineClassName: `yaml-dynamic-highlight-${highlightState.highlightedFromYaml.id}`,
              },
            }]);
          }
        }

        // Inject dynamic style
        const styleId = `yaml-highlight-style-${highlightState.highlightedFromYaml.id}`;
        let styleEl = document.getElementById(styleId);
        if (!styleEl) {
          styleEl = document.createElement('style');
          styleEl.id = styleId;
          document.head.appendChild(styleEl);
        }
        styleEl.textContent = `
          .yaml-dynamic-highlight-${highlightState.highlightedFromYaml.id} {
            background-color: ${pastelColor} !important;
          }
        `;
      }
    }

    // Highlight selected systems (from Diagram → YAML interaction)
    if (currentLandscape) {
      highlightState.selectedNodeIds.forEach((systemId) => {
        // Skip if this is already highlighted as cursor element
        if (highlightState.highlightedFromYaml.type === 'system' &&
            highlightState.highlightedFromYaml.id === systemId) {
          return;
        }

        const lineRange = YamlLineMapper.getLineRangeForElement(value, 'system', systemId);
        if (lineRange) {
          // Get system color
          const system = currentLandscape.systems.find(s => s.id === systemId);
          const pastelColor = colorToPastel(system?.style?.color, 0.25);

          console.log(`[YamlEditor] Highlighting system ${systemId} (lines ${lineRange.start}-${lineRange.end}) with color ${pastelColor}`);

          // Inject dynamic style
          const styleId = `yaml-highlight-style-${systemId}`;
          let styleEl = document.getElementById(styleId);
          if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = styleId;
            document.head.appendChild(styleEl);
          }
          styleEl.textContent = `
            .yaml-dynamic-highlight-${systemId} {
              background-color: ${pastelColor} !important;
            }
          `;

          newDecorations.push({
            range: new monacoInstance.Range(lineRange.start, 1, lineRange.end, 1),
            options: {
              isWholeLine: true,
              inlineClassName: `yaml-dynamic-highlight-${systemId}`,
            },
          });
        }
      });
    }

    // Highlight selected connections (from Diagram → YAML interaction)
    if (currentLandscape) {
      highlightState.selectedEdgeIds.forEach((edgeId) => {
        // Skip if this is already highlighted as cursor element
        if (highlightState.highlightedFromYaml.type === 'connection' &&
            highlightState.highlightedFromYaml.id === edgeId) {
          return;
        }

        const lineRange = YamlLineMapper.getLineRangeForElement(value, 'connection', edgeId);
        if (lineRange) {
          // Get connection color
          const connection = currentLandscape.connections.find(c => `${c.from}-${c.to}` === edgeId);
          const pastelColor = colorToPastel(connection?.style?.color, 0.25);

          console.log(`[YamlEditor] Highlighting connection ${edgeId} with color ${pastelColor}`);

          // Inject dynamic style
          const styleId = `yaml-highlight-style-${edgeId}`;
          let styleEl = document.getElementById(styleId);
          if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = styleId;
            document.head.appendChild(styleEl);
          }
          styleEl.textContent = `
            .yaml-dynamic-highlight-${edgeId.replace(/[^a-zA-Z0-9-]/g, '_')} {
              background-color: ${pastelColor} !important;
            }
          `;

          newDecorations.push({
            range: new monacoInstance.Range(lineRange.start, 1, lineRange.end, 1),
            options: {
              isWholeLine: true,
              inlineClassName: `yaml-dynamic-highlight-${edgeId.replace(/[^a-zA-Z0-9-]/g, '_')}`,
            },
          });
        }
      });
    }

    // NOTE: Removed related edges highlighting for exclusive selection

    // Apply decorations
    decorationsRef.current = editor.deltaDecorations([], newDecorations);

    // Scroll to element (prioritize cursor position, then selection)
    if (highlightState.highlightedFromYaml.id) {
      const elementType = highlightState.highlightedFromYaml.type === 'system' ? 'system' : 'connection';
      const lineRange = YamlLineMapper.getLineRangeForElement(
        value,
        elementType,
        highlightState.highlightedFromYaml.id
      );
      if (lineRange) {
        editor.revealLineInCenter(lineRange.start);
      }
    } else if (newDecorations.length > 0 && highlightState.selectedNodeIds.length > 0) {
      const firstSystemId = highlightState.selectedNodeIds[0];
      const lineRange = YamlLineMapper.getLineRangeForElement(value, 'system', firstSystemId);
      if (lineRange) {
        editor.revealLineInCenter(lineRange.start);
      }
    }
  }, [highlightState.selectedNodeIds, highlightState.selectedEdgeIds, highlightState.relatedEdgeIds, highlightState.highlightedFromYaml, value]);

  return (
    <Editor
      height={height}
      defaultLanguage="yaml"
      value={value}
      onChange={handleEditorChange}
      onMount={handleEditorDidMount}
      options={{
        readOnly,
        minimap: { enabled: true },
        fontSize: 14,
        lineNumbers: 'on',
        roundedSelection: true,
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        insertSpaces: true,
        wordWrap: 'on',
        formatOnPaste: true,
        formatOnType: true,
        suggestOnTriggerCharacters: true,
        quickSuggestions: {
          other: true,
          comments: false,
          strings: true,
        },
        scrollbar: {
          vertical: 'visible',
          horizontal: 'visible',
          useShadows: false,
          verticalScrollbarSize: 10,
          horizontalScrollbarSize: 10,
        },
        theme: 'vs-light',
        glyphMargin: true,  // Enable glyph margin for gutter decorations
      }}
    />
  );
}
