"""Service for file system operations."""

import os
import aiofiles
from pathlib import Path
from typing import Optional
from datetime import datetime
from app.models.landscape import Landscape
from app.services.yaml_service import YAMLService


class FileService:
    """Service for handling file operations."""

    def __init__(self, data_dir: str = "data"):
        """
        Initialize file service.

        Args:
            data_dir: Directory where landscape files are stored
        """
        self.data_dir = Path(data_dir).resolve()
        self.data_dir.mkdir(parents=True, exist_ok=True)

    def _get_file_path(self, landscape_id: str) -> Path:
        """
        Get the safe file path for a landscape ID, allowing subdirectories.
        
        Raises:
            PermissionError: If the path attempts to traverse outside the data directory.
        """
        # Safely join the path and resolve it to an absolute path
        file_path = (self.data_dir / f"{landscape_id}.yaml").resolve()

        # Security check: Ensure the resolved path is within the data directory
        if self.data_dir not in file_path.parents:
            raise PermissionError(f"Directory traversal attempt detected for: {landscape_id}")

        return file_path

    async def list_landscapes(self) -> list[dict]:
        """
        List all available landscape files, including those in subdirectories.

        Returns:
            list[dict]: List of landscape metadata
        """
        landscapes = []

        # Use rglob to find all yaml files recursively
        for file_path in self.data_dir.rglob("*.yaml"):
            try:
                # Construct the ID from the relative path to the data_dir
                relative_path = file_path.relative_to(self.data_dir)
                landscape_id = str(relative_path.with_suffix(''))

                content = await self.read_landscape(landscape_id)
                # Use the raw parser to just get metadata without crashing on old formats
                landscape = YAMLService.parse_yaml(content)

                landscapes.append({
                    "id": landscape_id,
                    "title": landscape.metadata.title,
                    "description": landscape.metadata.description,
                    "version": landscape.metadata.version,
                    "last_updated": landscape.metadata.last_updated.isoformat() if landscape.metadata.last_updated else None,
                    "file_path": str(file_path)
                })
            except Exception as e:
                # Skip invalid files
                print(f"Warning: Could not load {file_path}: {e}")
                continue

        return landscapes

    async def read_landscape(self, landscape_id: str) -> str:
        """
        Read a landscape file.

        Args:
            landscape_id: ID of the landscape to read

        Returns:
            str: YAML content

        Raises:
            FileNotFoundError: If file doesn't exist
        """
        file_path = self._get_file_path(landscape_id)

        if not file_path.exists():
            raise FileNotFoundError(f"Landscape '{landscape_id}' not found")

        async with aiofiles.open(file_path, 'r', encoding='utf-8') as f:
            content = await f.read()

        return content

    async def read_landscape_parsed(self, landscape_id: str) -> Landscape:
        """
        Read and parse a landscape file.

        Args:
            landscape_id: ID of the landscape to read

        Returns:
            Landscape: Parsed landscape object

        Raises:
            FileNotFoundError: If file doesn't exist
            ValueError: If YAML is invalid
        """
        content = await self.read_landscape(landscape_id)
        return YAMLService.parse_yaml(content)

    async def write_landscape(
        self,
        landscape_id: str,
        content: str,
        validate: bool = True
    ) -> None:
        """
        Write a landscape file.

        Args:
            landscape_id: ID of the landscape
            content: YAML content to write
            validate: Whether to validate before writing

        Raises:
            ValueError: If validation fails
        """
        if validate:
            is_valid, error = YAMLService.validate_yaml(content)
            if not is_valid:
                raise ValueError(f"Invalid YAML: {error}")

        file_path = self._get_file_path(landscape_id)

        async with aiofiles.open(file_path, 'w', encoding='utf-8') as f:
            await f.write(content)

    async def write_landscape_object(
        self,
        landscape_id: str,
        landscape: Landscape
    ) -> None:
        """
        Write a Landscape object to file.

        Args:
            landscape_id: ID of the landscape
            landscape: Landscape object to write
        """
        # Update last_updated timestamp
        landscape.metadata.last_updated = datetime.now()

        content = YAMLService.serialize_to_yaml(landscape)
        await self.write_landscape(landscape_id, content, validate=False)

    async def delete_landscape(self, landscape_id: str) -> None:
        """
        Delete a landscape file.

        Args:
            landscape_id: ID of the landscape to delete

        Raises:
            FileNotFoundError: If file doesn't exist
        """
        file_path = self._get_file_path(landscape_id)

        if not file_path.exists():
            raise FileNotFoundError(f"Landscape '{landscape_id}' not found")

        file_path.unlink()

    async def landscape_exists(self, landscape_id: str) -> bool:
        """
        Check if a landscape file exists.

        Args:
            landscape_id: ID of the landscape

        Returns:
            bool: True if file exists
        """
        file_path = self._get_file_path(landscape_id)
        return file_path.exists()

    async def update_positions(
        self,
        landscape_id: str,
        position_updates: dict[str, dict[str, float]]
    ) -> None:
        """
        Update system positions in a landscape file.

        Args:
            landscape_id: ID of the landscape
            position_updates: Dict mapping system IDs to {x, y} positions

        Raises:
            FileNotFoundError: If file doesn't exist
            ValueError: If update fails
        """
        content = await self.read_landscape(landscape_id)
        updated_content = YAMLService.update_positions(content, position_updates)
        await self.write_landscape(landscape_id, updated_content, validate=True)
