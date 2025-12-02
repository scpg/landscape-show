"""Pydantic models for landscape data structures."""

from datetime import datetime
from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field, field_validator


class SystemType(str, Enum):
    """Types of systems in the landscape."""
    CUSTOMER_FACING = "customer-facing"
    BACKEND = "backend"
    DATABASE = "database"
    EXTERNAL = "external"
    INTEGRATION = "integration"
    ANALYTICS = "analytics"


class ConnectionType(str, Enum):
    """Types of connections between systems."""
    API = "api"
    DATABASE = "database"
    FILE_TRANSFER = "file-transfer"
    MESSAGE_QUEUE = "message-queue"
    MANUAL = "manual"
    EVENT = "event"


class LineStyle(str, Enum):
    """Line styles for connections."""
    SOLID = "solid"
    DASHED = "dashed"
    DOTTED = "dotted"


class Position(BaseModel):
    """Position coordinates for a system on the canvas."""
    x: float = Field(..., description="X coordinate")
    y: float = Field(..., description="Y coordinate")


class Style(BaseModel):
    """Visual styling options."""
    color: Optional[str] = Field(None, description="Color in hex format (e.g., #4A90E2)")
    icon: Optional[str] = Field(None, description="Icon name")
    backgroundColor: Optional[str] = Field(None, description="Background color for groups")
    borderColor: Optional[str] = Field(None, description="Border color")
    lineStyle: Optional[LineStyle] = Field(LineStyle.SOLID, description="Line style for connections")
    animated: Optional[bool] = Field(False, description="Whether connection is animated")


class Metadata(BaseModel):
    """Metadata about the landscape diagram."""
    title: str = Field(..., description="Title of the landscape")
    description: Optional[str] = Field(None, description="Description of the landscape")
    version: str = Field(default="1.0", description="Version of the landscape")
    last_updated: Optional[datetime] = Field(None, description="Last update timestamp")
    author: Optional[str] = Field(None, description="Author of the landscape")


class System(BaseModel):
    """A system in the landscape."""
    id: str = Field(..., description="Unique identifier for the system")
    name: str = Field(..., description="Display name of the system")
    type: SystemType = Field(..., description="Type of system")
    description: Optional[str] = Field(None, description="Description of the system")
    owner: Optional[str] = Field(None, description="Team or person owning the system")
    technology: Optional[str] = Field(None, description="Technology stack")
    position: Position = Field(..., description="Position on the canvas")
    style: Optional[Style] = Field(None, description="Visual styling options")

    @field_validator('id')
    @classmethod
    def validate_id(cls, v: str) -> str:
        """Validate that ID is lowercase with hyphens only."""
        if not v:
            raise ValueError("ID cannot be empty")
        if not v.replace('-', '').replace('_', '').isalnum():
            raise ValueError("ID must contain only alphanumeric characters, hyphens, and underscores")
        return v.lower()


class Connection(BaseModel):
    """A connection between two systems."""
    from_: str = Field(..., alias="from", description="Source system ID")
    to: str = Field(..., description="Target system ID")
    label: Optional[str] = Field(None, description="Label for the connection")
    type: ConnectionType = Field(..., description="Type of connection")
    description: Optional[str] = Field(None, description="Description of the connection")
    style: Optional[Style] = Field(None, description="Visual styling options")

    class Config:
        populate_by_name = True


class Group(BaseModel):
    """A logical grouping of systems."""
    id: str = Field(..., description="Unique identifier for the group")
    name: str = Field(..., description="Display name of the group")
    systems: list[str] = Field(default_factory=list, description="List of system IDs in this group")
    style: Optional[Style] = Field(None, description="Visual styling options")


class Landscape(BaseModel):
    """Complete landscape model."""
    metadata: Metadata = Field(..., description="Metadata about the landscape")
    systems: list[System] = Field(default_factory=list, description="List of systems")
    connections: list[Connection] = Field(default_factory=list, description="List of connections")
    groups: Optional[list[Group]] = Field(default_factory=list, description="Optional groupings")

    @field_validator('systems')
    @classmethod
    def validate_unique_system_ids(cls, v: list[System]) -> list[System]:
        """Ensure all system IDs are unique."""
        ids = [system.id for system in v]
        if len(ids) != len(set(ids)):
            raise ValueError("System IDs must be unique")
        return v

    @field_validator('connections')
    @classmethod
    def validate_connection_references(cls, v: list[Connection], info) -> list[Connection]:
        """Ensure all connections reference valid systems."""
        if 'systems' in info.data:
            system_ids = {system.id for system in info.data['systems']}
            for conn in v:
                if conn.from_ not in system_ids:
                    raise ValueError(f"Connection references non-existent system: {conn.from_}")
                if conn.to not in system_ids:
                    raise ValueError(f"Connection references non-existent system: {conn.to}")
        return v

    class Config:
        json_schema_extra = {
            "example": {
                "metadata": {
                    "title": "Company System Landscape",
                    "description": "Overview of all systems",
                    "version": "1.0"
                },
                "systems": [
                    {
                        "id": "crm-system",
                        "name": "CRM System",
                        "type": "customer-facing",
                        "description": "Customer relationship management",
                        "owner": "Sales Team",
                        "position": {"x": 100, "y": 100}
                    }
                ],
                "connections": [
                    {
                        "from": "crm-system",
                        "to": "billing-system",
                        "label": "Customer Orders",
                        "type": "api"
                    }
                ]
            }
        }
