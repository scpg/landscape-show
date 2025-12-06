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
  const { highlightState, setCursorLine } = useLandscapeStore();

  const handleEditorDidMount: OnMount = (editor, monacoInstance) => {
    editorRef.current = editor;
    monacoRef.current = monacoInstance;

    // Listen to cursor position changes
    editor.onDidChangeCursorPosition((e) => {
      const line = e.position.lineNumber;
      setCursorLine(line);
    });
  };

  const handleEditorChange = (value: string | undefined) => {
    const newValue = value || '';
    onChange(newValue);

    // Rebuild line map when content changes
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

    const editor = editorRef.current;
    const monacoInstance = monacoRef.current;

    // Clear previous decorations
    decorationsRef.current = editor.deltaDecorations(decorationsRef.current, []);

    const newDecorations: monaco.editor.IModelDeltaDecoration[] = [];

    // Highlight selected systems
    highlightState.selectedNodeIds.forEach((systemId) => {
      const lineRange = YamlLineMapper.getLineRangeForElement(value, 'system', systemId);
      if (lineRange) {
        newDecorations.push({
          range: new monacoInstance.Range(lineRange.start, 1, lineRange.end, 1),
          options: {
            isWholeLine: true,
            className: 'yaml-highlight-system',
            glyphMarginClassName: 'yaml-highlight-glyph',
            linesDecorationsClassName: 'yaml-highlight-line-decoration',
          },
        });
      }
    });

    // Highlight selected connections
    highlightState.selectedEdgeIds.forEach((edgeId) => {
      const lineRange = YamlLineMapper.getLineRangeForElement(value, 'connection', edgeId);
      if (lineRange) {
        newDecorations.push({
          range: new monacoInstance.Range(lineRange.start, 1, lineRange.end, 1),
          options: {
            isWholeLine: true,
            className: 'yaml-highlight-connection',
            glyphMarginClassName: 'yaml-highlight-glyph-connection',
            linesDecorationsClassName: 'yaml-highlight-line-decoration',
          },
        });
      }
    });

    // Highlight related connections (subtle)
    highlightState.relatedEdgeIds.forEach((edgeId) => {
      if (!highlightState.selectedEdgeIds.includes(edgeId)) {
        const lineRange = YamlLineMapper.getLineRangeForElement(value, 'connection', edgeId);
        if (lineRange) {
          newDecorations.push({
            range: new monacoInstance.Range(lineRange.start, 1, lineRange.end, 1),
            options: {
              isWholeLine: true,
              className: 'yaml-highlight-related',
              linesDecorationsClassName: 'yaml-highlight-line-decoration-subtle',
            },
          });
        }
      }
    });

    // Apply decorations
    decorationsRef.current = editor.deltaDecorations([], newDecorations);

    // Scroll to first selected element (optional)
    if (newDecorations.length > 0 && highlightState.selectedNodeIds.length > 0) {
      const firstSystemId = highlightState.selectedNodeIds[0];
      const lineRange = YamlLineMapper.getLineRangeForElement(value, 'system', firstSystemId);
      if (lineRange) {
        editor.revealLineInCenter(lineRange.start);
      }
    }
  }, [highlightState.selectedNodeIds, highlightState.selectedEdgeIds, highlightState.relatedEdgeIds, value]);

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
