# YAML Schema Reference

This document describes the YAML format for creating system landscape diagrams.

## Overview

Landscape YAML files consist of three main sections:
1. **Metadata** - Information about the diagram
2. **Systems** - The boxes in your diagram
3. **Connections** - The lines between systems
4. **Groups** (optional) - Logical groupings of systems

## Complete Example

```yaml
metadata:
  title: "Company System Landscape"
  description: "Overview of all systems and their connections"
  version: "1.0"
  author: "Architecture Team"

systems:
  - id: crm-system
    name: "CRM System"
    type: customer-facing
    description: "Customer relationship management"
    owner: "Sales Team"
    technology: "Salesforce"
    position:
      x: 100
      y: 100
    style:
      color: "#4A90E2"
      icon: "users"

connections:
  - from: crm-system
    to: billing-system
    label: "Customer Orders"
    type: api
    description: "REST API calls"
    style:
      lineStyle: solid
      edgeType: default
      animated: false

groups:
  - id: frontend-systems
    name: "Customer-Facing Systems"
    systems: [crm-system]
    style:
      backgroundColor: "#f0f8ff"
      borderColor: "#4A90E2"
```

## Metadata Section

Information about the landscape diagram.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Title of the landscape |
| `description` | string | No | Description of what the landscape shows |
| `version` | string | No | Version number (default: "1.0") |
| `last_updated` | datetime | No | Last update timestamp (auto-updated) |
| `author` | string | No | Author or team name |

**Example:**
```yaml
metadata:
  title: "E-Commerce Platform"
  description: "Main systems for our online store"
  version: "2.1"
  author: "Platform Team"
```

## Systems Section

Systems are the boxes/nodes in your diagram.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier (lowercase, hyphens/underscores only) |
| `name` | string | Yes | Display name |
| `type` | enum | Yes | Type of system (see types below) |
| `description` | string | No | What the system does |
| `owner` | string | No | Team or person responsible |
| `technology` | string | No | Technology stack or vendor |
| `position` | object | Yes | X,Y coordinates on canvas |
| `style` | object | No | Visual styling options |

### System Types

- `customer-facing` - User-facing applications (web, mobile)
- `backend` - Backend services and APIs
- `database` - Database systems
- `external` - External/third-party systems
- `integration` - Integration middleware
- `analytics` - Analytics and BI platforms

### Position Object

```yaml
position:
  x: 100  # Horizontal position in pixels
  y: 200  # Vertical position in pixels
```

**Note:** Positions are automatically updated when you drag systems in the GUI.

### Style Object (Optional)

```yaml
style:
  color: "#4A90E2"      # Hex color for the system box
  icon: "database"      # Icon name (future feature)
```

### Example System

```yaml
- id: payment-gateway
  name: "Payment Gateway"
  type: external
  description: "Stripe payment processing"
  owner: "Finance Team"
  technology: "Stripe API"
  position:
    x: 500
    y: 300
  style:
    color: "#6772E5"
```

## Connections Section

Connections are the lines/edges between systems.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `from` | string | Yes | Source system ID |
| `to` | string | Yes | Target system ID |
| `label` | string | No | Text label on the connection |
| `type` | enum | Yes | Type of connection (see types below) |
| `description` | string | No | Details about the connection |
| `style` | object | No | Visual styling options |

### Connection Types

- `api` - REST API, GraphQL, gRPC
- `database` - Direct database connection
- `file-transfer` - File-based data transfer
- `message-queue` - Message queues (Kafka, RabbitMQ, SQS)
- `manual` - Manual process or intervention
- `event` - Event-driven communication

### Connection Style Object (Optional)

```yaml
style:
  lineStyle: solid    # solid, dashed, or dotted
  edgeType: default   # default (bezier), straight, step, smoothstep, or bezier
  animated: true      # Show animated flow
  color: "#666"       # Line color
```

**Edge Types:**
- `default` - Smooth bezier curve (default)
- `bezier` - Alias for default, smooth bezier curve
- `straight` - Direct straight line between nodes
- `step` - Right-angled step line (hard corners)
- `smoothstep` - Right-angled step line with rounded corners

**Line Styles:**
- `solid` - Solid line (default)
- `dashed` - Dashed line
- `dotted` - Dotted line

You can combine edge types with line styles. For example: `edgeType: smoothstep` with `lineStyle: dashed`

### Example Connections

```yaml
# Smooth bezier curve with solid line
- from: web-app
  to: api-gateway
  label: "HTTPS Requests"
  type: api
  description: "User requests routed through API gateway"
  style:
    lineStyle: solid
    edgeType: default
    animated: true

# Straight line with dashed style
- from: api-gateway
  to: cache-service
  label: "Cache Check"
  type: api
  style:
    lineStyle: dashed
    edgeType: straight
    animated: false

# Smooth step line (right angles with rounded corners)
- from: service-a
  to: service-b
  label: "Event Stream"
  type: message-queue
  style:
    lineStyle: dotted
    edgeType: smoothstep
    animated: true
```

## Groups Section (Optional)

Groups allow you to visually organize related systems.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier |
| `name` | string | Yes | Display name for the group |
| `systems` | array | Yes | List of system IDs in this group |
| `style` | object | No | Visual styling |

### Group Style Object

```yaml
style:
  backgroundColor: "#f0f8ff"  # Background color
  borderColor: "#4A90E2"      # Border color
```

### Example Group

```yaml
- id: backend-services
  name: "Core Backend Services"
  systems:
    - api-gateway
    - user-service
    - order-service
  style:
    backgroundColor: "#fff4e6"
    borderColor: "#f39c12"
```

## Best Practices

### Naming Conventions

**System IDs:**
- Use lowercase
- Separate words with hyphens: `user-service`
- Be descriptive but concise: `crm-system` not `crm`

**Display Names:**
- Use proper capitalization: "CRM System"
- Keep them short for better diagram readability

### Organizing Large Landscapes

1. **Use Groups** to organize related systems
2. **Position strategically**:
   - Customer-facing systems at the top
   - Databases at the bottom
   - External systems on the right
3. **Limit connections**: Only show the most important ones
4. **Multiple landscapes**: Create separate files for different views

### Positioning Tips

- **Start simple**: Let the auto-layout feature arrange systems initially (future)
- **Grid alignment**: Use multiples of 50 or 100 for cleaner layouts
- **Spacing**: Leave at least 200px between systems for readability
- **Don't worry about exact positions**: You can adjust them in the GUI!

## Validation

The tool automatically validates your YAML:

- ✅ All system IDs must be unique
- ✅ Connection `from` and `to` must reference existing systems
- ✅ Group systems must reference existing system IDs
- ✅ Required fields must be present
- ✅ Enums must use valid values

**Invalid Example:**
```yaml
connections:
  - from: nonexistent-system  # ❌ Error: system doesn't exist
    to: another-system
    type: api
```

## Color Palette Suggestions

Here are some suggested colors for different system types:

| System Type | Color | Hex Code |
|-------------|-------|----------|
| Customer-Facing | Blue | `#4A90E2` |
| Backend | Orange | `#F39C12` |
| Database | Navy | `#336791` |
| External | Purple | `#6772E5` |
| Integration | Green | `#27AE60` |
| Analytics | Deep Purple | `#8E44AD` |

## Full Example: E-Commerce Platform

```yaml
metadata:
  title: "E-Commerce Platform Architecture"
  description: "Main systems powering our online store"
  version: "1.0"
  author: "Platform Architecture Team"

systems:
  - id: web-app
    name: "Web Application"
    type: customer-facing
    description: "Customer-facing e-commerce website"
    owner: "Frontend Team"
    technology: "React + Next.js"
    position: {x: 400, y: 50}
    style: {color: "#4A90E2"}

  - id: mobile-app
    name: "Mobile App"
    type: customer-facing
    description: "iOS and Android mobile apps"
    owner: "Mobile Team"
    technology: "React Native"
    position: {x: 700, y: 50}
    style: {color: "#4A90E2"}

  - id: api-gateway
    name: "API Gateway"
    type: backend
    description: "Kong API Gateway"
    owner: "Platform Team"
    technology: "Kong"
    position: {x: 550, y: 200}
    style: {color: "#F39C12"}

  - id: product-service
    name: "Product Service"
    type: backend
    description: "Product catalog and inventory"
    owner: "Backend Team"
    technology: "Node.js"
    position: {x: 300, y: 350}
    style: {color: "#F39C12"}

  - id: order-service
    name: "Order Service"
    type: backend
    description: "Order processing and management"
    owner: "Backend Team"
    technology: "Node.js"
    position: {x: 550, y: 350}
    style: {color: "#F39C12"}

  - id: payment-service
    name: "Payment Service"
    type: backend
    description: "Payment processing"
    owner: "Backend Team"
    technology: "Java Spring"
    position: {x: 800, y: 350}
    style: {color: "#F39C12"}

  - id: main-db
    name: "PostgreSQL"
    type: database
    description: "Main relational database"
    owner: "Data Team"
    technology: "PostgreSQL 15"
    position: {x: 550, y: 500}
    style: {color: "#336791"}

  - id: stripe
    name: "Stripe"
    type: external
    description: "Payment gateway"
    owner: "Finance Team"
    technology: "Stripe API"
    position: {x: 1000, y: 350}
    style: {color: "#6772E5"}

connections:
  - {from: web-app, to: api-gateway, label: "HTTPS", type: api}
  - {from: mobile-app, to: api-gateway, label: "HTTPS", type: api}
  - {from: api-gateway, to: product-service, label: "gRPC", type: api, style: {edgeType: straight}}
  - {from: api-gateway, to: order-service, label: "gRPC", type: api, style: {edgeType: smoothstep}}
  - {from: api-gateway, to: payment-service, label: "gRPC", type: api, style: {edgeType: step}}
  - {from: product-service, to: main-db, label: "SQL", type: database}
  - {from: order-service, to: main-db, label: "SQL", type: database}
  - {from: payment-service, to: main-db, label: "SQL", type: database}
  - {from: payment-service, to: stripe, label: "REST API", type: api, style: {lineStyle: dashed, edgeType: smoothstep}}

groups:
  - id: frontend
    name: "Customer Applications"
    systems: [web-app, mobile-app]
    style: {backgroundColor: "#e8f4f8", borderColor: "#4A90E2"}

  - id: backend
    name: "Backend Services"
    systems: [api-gateway, product-service, order-service, payment-service]
    style: {backgroundColor: "#fff4e6", borderColor: "#F39C12"}
```
