import { useEffect } from 'react';
import { useLandscapeStore } from './stores/landscapeStore';
import DiagramCanvas from './components/DiagramCanvas/DiagramCanvas';

function App() {
  const {
    landscapes,
    currentLandscape,
    currentLandscapeId,
    isLoading,
    error,
    loadLandscapes,
    loadLandscape,
    updatePositions,
    clearError,
  } = useLandscapeStore();

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

      {/* Landscape selector */}
      <div
        style={{
          padding: '15px 20px',
          backgroundColor: '#f8f9fa',
          borderBottom: '1px solid #e0e0e0',
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
                }}
              >
                {landscape.title}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main content - Diagram Canvas */}
      <div style={{ flex: 1, position: 'relative', backgroundColor: '#f8f9fa' }}>
        {currentLandscape ? (
          <>
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
          </>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
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
