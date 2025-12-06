# Edge Types Reference

This document describes all available edge types and line styles for connections in Landscape Show.

## Edge Types (Path Shapes)

Edge types control the **shape** of the connection path between systems.

### 1. `default` or `bezier`
**Curved Bezier path** - Smooth curved line connecting two points.

```yaml
style:
  edgeType: default  # or 'bezier'
```

**Use case:** General connections, API calls, smooth visual flow

---

### 2. `straight`
**Direct straight line** - Simple point-to-point connection.

```yaml
style:
  edgeType: straight
```

**Use case:** Direct connections, database links, simple relationships

---

### 3. `step`
**Right-angle stepped path** - Path with sharp 90-degree corners.

```yaml
style:
  edgeType: step
```

**Use case:** Structured flows, architectural diagrams, orthogonal layouts

---

### 4. `smoothstep`
**Rounded stepped path** - Path with rounded corners instead of sharp angles.

```yaml
style:
  edgeType: smoothstep
```

**Use case:** Modern looking flows, softer architectural diagrams

---

## Line Styles (Stroke Patterns)

Line styles control the **appearance** of the line itself (independent of shape).

### 1. `solid`
**Solid continuous line** - Default, no dashes.

```yaml
style:
  lineStyle: solid
```

**Use case:** Primary connections, always-active flows

---

### 2. `dashed`
**Dashed line** - Line with regular dashes (pattern: 8px dash, 4px gap).

```yaml
style:
  lineStyle: dashed
```

**Use case:** Optional connections, external APIs, conditional flows

---

### 3. `dotted`
**Dotted line** - Line with small dots (pattern: 2px dash, 2px gap).

```yaml
style:
  lineStyle: dotted
```

**Use case:** Weak connections, message queues, async communication

---

## Combining Edge Types and Line Styles

You can combine any edge type with any line style:

```yaml
connections:
  # Curved + Solid
  - from: system-a
    to: system-b
    label: API Call
    type: api
    style:
      edgeType: default
      lineStyle: solid
      animated: false

  # Straight + Dashed
  - from: system-a
    to: system-c
    label: Optional Connection
    type: api
    style:
      edgeType: straight
      lineStyle: dashed
      animated: false

  # Smoothstep + Dotted
  - from: system-b
    to: system-c
    label: Message Queue
    type: message-queue
    style:
      edgeType: smoothstep
      lineStyle: dotted
      animated: true
```

---

## Complete Example

The sample landscape (`backend/data/examples/sample-landscape.yaml`) demonstrates all combinations:

1. **Default/Bezier + Solid** - CRM → Billing (curved solid line)
2. **Straight + Solid** - CRM → Database (straight solid line)
3. **Step + Solid** - Billing → Database (right-angle solid line)
4. **Smoothstep + Dashed** - Billing → Payment Gateway (rounded corners, dashed)
5. **Bezier + Solid** - Inventory → Database (curved solid line)
6. **Straight + Dotted** - Inventory → Billing (straight dotted line)
7. **Smoothstep + Dashed** - Database → Analytics (rounded corners, dashed)

---

## Animation

Connections can also be animated (moving dots along the path):

```yaml
style:
  edgeType: straight
  lineStyle: solid
  animated: true  # Enable animation
```

**Use case:** Active data flows, real-time connections, live transfers

---

## Visual Comparison

| Edge Type | Line Style | Appearance | Best For |
|-----------|------------|------------|----------|
| `default` | `solid` | Curved, continuous | Standard connections |
| `straight` | `solid` | Direct, continuous | Simple relationships |
| `step` | `solid` | Right angles, continuous | Structured flows |
| `smoothstep` | `solid` | Rounded corners, continuous | Modern flows |
| `default` | `dashed` | Curved, dashed | Optional APIs |
| `straight` | `dashed` | Direct, dashed | Conditional connections |
| `straight` | `dotted` | Direct, dotted | Message queues |
| `smoothstep` | `dotted` | Rounded, dotted | Async communication |

---

## Default Values

If not specified, the defaults are:

```yaml
style:
  edgeType: default     # Bezier curve
  lineStyle: solid      # Continuous line
  animated: false       # No animation
```

---

## Implementation Details

### Frontend (CustomEdge.tsx)

The `CustomEdge` component uses React Flow's path functions:

- `getBezierPath()` - for `default` and `bezier` types
- `getStraightPath()` - for `straight` type
- `getSmoothStepPath()` - for `step` and `smoothstep` types
  - `borderRadius: 0` for `step`
  - `borderRadius: 16` for `smoothstep`

### Stroke Dash Patterns

```typescript
solid:  strokeDasharray = "0"
dashed: strokeDasharray = "8, 4"
dotted: strokeDasharray = "2, 2"
```

---

## Tips for Choosing Edge Types

1. **Use `straight` for direct database connections** - Shows clear data flow
2. **Use `smoothstep` for external APIs** - Visually distinct from internal connections
3. **Use `dashed` for optional/conditional flows** - Shows they're not always active
4. **Use `dotted` for async/queue connections** - Indicates decoupled communication
5. **Use animation for real-time flows** - Highlights active data transfers
6. **Mix edge types for visual hierarchy** - Different types help distinguish connection purposes

---

**Last Updated:** 2025-12-05
