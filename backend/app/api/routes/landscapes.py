"""API routes for landscape CRUD operations."""

from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel
from app.models.landscape import MergedLandscape
from app.services.file_service import FileService
from app.services.yaml_service import YAMLService
from app.config import settings


router = APIRouter(prefix="/landscapes", tags=["landscapes"])
file_service = FileService(str(settings.data_dir))


class LandscapeListItem(BaseModel):
    """Summary information about a landscape."""
    id: str
    title: str
    description: str | None
    version: str
    last_updated: str | None
    file_path: str


class LandscapeResponse(BaseModel):
    """Response model for landscape data."""
    id: str
    yaml: str
    parsed: MergedLandscape


class PositionUpdate(BaseModel):
    """Position update request."""
    x: float
    y: float


class PositionUpdates(BaseModel):
    """Batch position updates."""
    updates: dict[str, PositionUpdate]


@router.post("/validate")
async def validate_landscape_content(yaml_content: str = Body(..., media_type="text/plain")):
    """
    Validate YAML content without saving.

    This endpoint is ID-agnostic so editors can validate arbitrary drafts
    without touching persisted files.
    """
    is_valid, error = YAMLService.validate_yaml(yaml_content)

    if is_valid:
        return {"valid": True, "message": "YAML is valid"}
    else:
        return {"valid": False, "error": error}


@router.get("", response_model=list[LandscapeListItem])
async def list_landscapes():
    """List all available landscapes."""
    try:
        landscapes = await file_service.list_landscapes()
        return landscapes
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{landscape_id}", response_model=LandscapeResponse)
async def get_landscape(landscape_id: str):
    """Get a specific landscape by ID."""
    try:
        yaml_content = await file_service.read_landscape(landscape_id)
        # Use the new service method to get the merged data structure
        parsed = YAMLService.get_merged_landscape(yaml_content)

        return LandscapeResponse(
            id=landscape_id,
            yaml=yaml_content,
            parsed=parsed
        )
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"Landscape '{landscape_id}' not found")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{landscape_id}", status_code=201)
async def create_landscape(
    landscape_id: str,
    yaml_content: str = Body(..., media_type="text/plain")
):
    """Create a new landscape."""
    try:
        if await file_service.landscape_exists(landscape_id):
            raise HTTPException(
                status_code=409,
                detail=f"Landscape '{landscape_id}' already exists"
            )

        await file_service.write_landscape(landscape_id, yaml_content, validate=True)
        return {"message": f"Landscape '{landscape_id}' created successfully"}

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{landscape_id}")
async def update_landscape(
    landscape_id: str,
    yaml_content: str = Body(..., media_type="text/plain")
):
    """Update an existing landscape."""
    try:
        if not await file_service.landscape_exists(landscape_id):
            raise HTTPException(
                status_code=404,
                detail=f"Landscape '{landscape_id}' not found"
            )

        await file_service.write_landscape(landscape_id, yaml_content, validate=True)
        return {"message": f"Landscape '{landscape_id}' updated successfully"}

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.patch("/{landscape_id}/positions")
async def update_positions(
    landscape_id: str,
    position_updates: PositionUpdates
):
    """Update system positions in a landscape."""
    try:
        if not await file_service.landscape_exists(landscape_id):
            raise HTTPException(
                status_code=404,
                detail=f"Landscape '{landscape_id}' not found"
            )

        # Convert PositionUpdate objects to dicts
        updates_dict = {
            system_id: {"x": pos.x, "y": pos.y}
            for system_id, pos in position_updates.updates.items()
        }

        await file_service.update_positions(landscape_id, updates_dict)
        return {"message": f"Positions updated for landscape '{landscape_id}'"}

    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"Landscape '{landscape_id}' not found")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{landscape_id}")
async def delete_landscape(landscape_id: str):
    """Delete a landscape."""
    try:
        await file_service.delete_landscape(landscape_id)
        return {"message": f"Landscape '{landscape_id}' deleted successfully"}

    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"Landscape '{landscape_id}' not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{landscape_id}/validate")
async def validate_landscape(yaml_content: str = Body(..., media_type="text/plain")):
    """Validate YAML content for a specific landscape (kept for compatibility)."""
    is_valid, error = YAMLService.validate_yaml(yaml_content)

    if is_valid:
        return {"valid": True, "message": "YAML is valid"}
    else:
        return {"valid": False, "error": error}
