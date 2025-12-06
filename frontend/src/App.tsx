import { useEffect, useState, useCallback } from 'react';
import { useLandscapeStore } from './stores/landscapeStore';
import DiagramCanvas from './components/DiagramCanvas/DiagramCanvas';
import YamlEditor from './components/YamlEditor/YamlEditor';
import { YAMLParser } from './services/yamlParser';

type ViewMode = 'diagram' | 'split' | 'yaml';

function App() {
  const {
    landscapes,
    currentLandscape,
    currentLandscapeId,
    yamlContent,
    isLoading,
    isSaving,
    error,
    loadLandscapes,
    loadLandscape,
    updatePositions,
    updateYaml,
    updateLandscape,
    saveLandscape,
    clearError,
  } = useLandscapeStore();

  // View mode state
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [yamlDebounceTimer, setYamlDebounceTimer] = useState<number | null>(null);

  useEffect(() => {
    loadLandscapes();
  }, []);

  const handleLoadLandscape = (id: string) => {
    loadLandscape(id);
  };

  const handlePositionChange = (updates: Record<string, { x: number; y: number }>) => {
    if (currentLandscapeId) {
      updatePositions(currentLandscapeId, updates);
    }
  };

  // Handle YAML editor changes with debouncing
  const handleYamlChange = useCallback((newYaml: string) => {
    // Update YAML content immediately
    updateYaml(newYaml);

    // Clear existing debounce timer
    if (yamlDebounceTimer) {
      clearTimeout(yamlDebounceTimer);
    }

    // Set new debounce timer (500ms)
    const timer = setTimeout(() => {
      try {
        // Parse YAML and update landscape
        const parsed = YAMLParser.parse(newYaml);
        updateLandscape(parsed);
        setValidationErrors([]);
      } catch (error) {
        // Keep validation errors but don't update diagram
        console.error('YAML parsing error:', error);
      }
    }, 500);

    setYamlDebounceTimer(timer);
  }, [yamlDebounceTimer, updateYaml, updateLandscape]);

  // Handle validation errors from Monaco Editor
  const handleValidation = useCallback((errors: string[]) => {
    setValidationErrors(errors);
  }, []);

  // Save YAML to backend (Ctrl+S or manual save)
  const handleSaveYaml = useCallback(() => {
    if (currentLandscapeId && yamlContent) {
      saveLandscape(currentLandscapeId, yamlContent);
    }
  }, [currentLandscapeId, yamlContent, saveLandscape]);

  // Keyboard shortcut for save (Ctrl+S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSaveYaml();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSaveYaml]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header */}
      <header
        style={{
          padding: '15px 20px',
          backgroundColor: '#ffffff',
          borderBottom: '2px solid #e0e0e0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        }}
      >
        <h1 style={{ color: '#4A90E2', margin: 0, fontSize: '24px' }}>
          Landscape Show
        </h1>
        <p style={{ color: '#666', margin: '5px 0 0 0', fontSize: '14px' }}>
          System Landscape Visualization Tool
        </p>
      </header>

      {/* Error message */}
      {error && (
        <div
          style={{
            backgroundColor: '#fee',
            color: '#c33',
            padding: '15px 20px',
            borderBottom: '1px solid #fcc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <strong>Error:</strong> {error}
          </div>
          <button
            onClick={clearError}
            style={{
              padding: '5px 10px',
              backgroundColor: '#c33',
              fontSize: '12px',
            }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Landscape selector & View toggle */}
      <div
        style={{
          padding: '15px 20px',
          backgroundColor: '#f8f9fa',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '15px',
        }}
      >
        {isLoading ? (
          <div style={{ color: '#666' }}>Loading landscapes...</div>
        ) : landscapes.length === 0 ? (
          <div style={{ color: '#666' }}>
            No landscapes found. Add YAML files to the backend/data directory.
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: '#666', fontWeight: 500 }}>
              Select landscape:
            </span>
            {landscapes.map((landscape) => (
              <button
                key={landscape.id}
                onClick={() => handleLoadLandscape(landscape.id)}
                style={{
                  padding: '8px 16px',
                  fontSize: '14px',
                  backgroundColor:
                    currentLandscapeId === landscape.id ? '#357ABD' : '#4A90E2',
                  border: 'none',
                  color: '#fff',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                {landscape.title}
              </button>
            ))}
          </div>
        )}

        {/* View Toggle */}
        {currentLandscape && (
          <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: '#666', fontWeight: 500, marginRight: '5px' }}>
              View:
            </span>
            <button
              onClick={() => setViewMode('diagram')}
              style={{
                padding: '8px 16px',
                fontSize: '13px',
                backgroundColor: viewMode === 'diagram' ? '#357ABD' : '#fff',
                color: viewMode === 'diagram' ? '#fff' : '#4A90E2',
                border: '1px solid #4A90E2',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: viewMode === 'diagram' ? 600 : 400,
              }}
            >
              📊 Diagram
            </button>
            <button
              onClick={() => setViewMode('split')}
              style={{
                padding: '8px 16px',
                fontSize: '13px',
                backgroundColor: viewMode === 'split' ? '#357ABD' : '#fff',
                color: viewMode === 'split' ? '#fff' : '#4A90E2',
                border: '1px solid #4A90E2',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: viewMode === 'split' ? 600 : 400,
              }}
            >
              ⚡ Split View
            </button>
            <button
              onClick={() => setViewMode('yaml')}
              style={{
                padding: '8px 16px',
                fontSize: '13px',
                backgroundColor: viewMode === 'yaml' ? '#357ABD' : '#fff',
                color: viewMode === 'yaml' ? '#fff' : '#4A90E2',
                border: '1px solid #4A90E2',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: viewMode === 'yaml' ? 600 : 400,
              }}
            >
              📝 YAML
            </button>

            {/* Save button */}
            {(viewMode === 'yaml' || viewMode === 'split') && (
              <button
                onClick={handleSaveYaml}
                disabled={isSaving || validationErrors.length > 0}
                style={{
                  padding: '8px 16px',
                  fontSize: '13px',
                  backgroundColor: validationErrors.length > 0 ? '#ccc' : '#27ae60',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: validationErrors.length > 0 ? 'not-allowed' : 'pointer',
                  marginLeft: '10px',
                  fontWeight: 600,
                }}
              >
                {isSaving ? '💾 Saving...' : '💾 Save (Ctrl+S)'}
              </button>
            )}

            {/* Validation status */}
            {(viewMode === 'yaml' || viewMode === 'split') && (
              <span style={{ marginLeft: '10px', fontSize: '13px' }}>
                {validationErrors.length === 0 ? (
                  <span style={{ color: '#27ae60' }}>✅ Valid</span>
                ) : (
                  <span style={{ color: '#e74c3c' }}>❌ {validationErrors.length} error(s)</span>
                )}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Main content - Diagram Canvas, YAML Editor, or Split View */}
      <div style={{ flex: 1, display: 'flex', position: 'relative', backgroundColor: '#f8f9fa' }}>
        {currentLandscape ? (
          <>
            {/* Diagram Only View */}
            {viewMode === 'diagram' && (
              <div style={{ flex: 1, position: 'relative' }}>
                {/* Landscape info overlay */}
                <div
                  style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    backgroundColor: '#ffffff',
                    padding: '15px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    zIndex: 10,
                    maxWidth: '300px',
                  }}
                >
                  <h2 style={{ fontSize: '16px', marginBottom: '5px' }}>
                    {currentLandscape.metadata.title}
                  </h2>
                  {currentLandscape.metadata.description && (
                    <p style={{ color: '#666', fontSize: '12px', margin: '5px 0' }}>
                      {currentLandscape.metadata.description}
                    </p>
                  )}
                  <div style={{ fontSize: '12px', color: '#95a5a6', marginTop: '10px' }}>
                    <div>
                      <strong>{currentLandscape.systems.length}</strong> systems
                    </div>
                    <div>
                      <strong>{currentLandscape.connections.length}</strong> connections
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      color: '#95a5a6',
                      marginTop: '10px',
                      fontStyle: 'italic',
                    }}
                  >
                    Drag nodes to reposition
                  </div>
                </div>

                {/* Diagram Canvas */}
                <DiagramCanvas
                  landscape={currentLandscape}
                  onPositionChange={handlePositionChange}
                />
              </div>
            )}

            {/* Split View */}
            {viewMode === 'split' && (
              <>
                {/* Left: Diagram */}
                <div style={{ flex: 1, position: 'relative', borderRight: '2px solid #e0e0e0' }}>
                  <DiagramCanvas
                    landscape={currentLandscape}
                    onPositionChange={handlePositionChange}
                  />
                </div>

                {/* Right: YAML Editor */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <YamlEditor
                      value={yamlContent}
                      onChange={handleYamlChange}
                      onValidation={handleValidation}
                    />
                  </div>

                  {/* Validation Error Panel */}
                  {validationErrors.length > 0 && (
                    <div
                      style={{
                        maxHeight: '150px',
                        overflowY: 'auto',
                        backgroundColor: '#fee',
                        borderTop: '2px solid #e74c3c',
                        padding: '15px',
                      }}
                    >
                      <div style={{ fontWeight: 600, color: '#c33', marginBottom: '10px' }}>
                        ❌ Validation Errors:
                      </div>
                      {validationErrors.map((error, index) => (
                        <div
                          key={index}
                          style={{
                            color: '#c33',
                            fontSize: '13px',
                            marginBottom: '5px',
                            fontFamily: 'monospace',
                          }}
                        >
                          {error}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* YAML Only View */}
            {viewMode === 'yaml' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <YamlEditor
                    value={yamlContent}
                    onChange={handleYamlChange}
                    onValidation={handleValidation}
                  />
                </div>

                {/* Validation Error Panel */}
                {validationErrors.length > 0 && (
                  <div
                    style={{
                      maxHeight: '150px',
                      overflowY: 'auto',
                      backgroundColor: '#fee',
                      borderTop: '2px solid #e74c3c',
                      padding: '15px',
                    }}
                  >
                    <div style={{ fontWeight: 600, color: '#c33', marginBottom: '10px' }}>
                      ❌ Validation Errors:
                    </div>
                    {validationErrors.map((error, index) => (
                      <div
                        key={index}
                        style={{
                          color: '#c33',
                          fontSize: '13px',
                          marginBottom: '5px',
                          fontFamily: 'monospace',
                        }}
                      >
                        {error}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              width: '100%',
              color: '#666',
              fontSize: '16px',
            }}
          >
            Select a landscape to visualize
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
