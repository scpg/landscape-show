"""Service for YAML parsing and validation."""

import yaml
from typing import Any
from pydantic import ValidationError
from app.models.landscape import Landscape


class YAMLService:
    """Service for handling YAML operations."""

    @staticmethod
    def parse_yaml(yaml_content: str) -> Landscape:
        """
        Parse YAML content into a Landscape model.

        Args:
            yaml_content: YAML string content

        Returns:
            Landscape: Validated Landscape object

        Raises:
            ValueError: If YAML is invalid or doesn't match schema
            ValidationError: If Pydantic validation fails
        """
        try:
            data = yaml.safe_load(yaml_content)
            if data is None:
                raise ValueError("YAML content is empty")

            landscape = Landscape(**data)
            return landscape

        except yaml.YAMLError as e:
            raise ValueError(f"Invalid YAML syntax: {str(e)}")
        except ValidationError as e:
            raise ValueError(f"Schema validation failed: {str(e)}")

    @staticmethod
    def serialize_to_yaml(landscape: Landscape) -> str:
        """
        Serialize a Landscape model to YAML string.

        Args:
            landscape: Landscape object to serialize

        Returns:
            str: YAML formatted string
        """
        # Convert Pydantic model to dict
        data = landscape.model_dump(by_alias=True, exclude_none=True)

        # Custom YAML formatting
        yaml_str = yaml.dump(
            data,
            default_flow_style=False,
            sort_keys=False,
            allow_unicode=True,
            indent=2,
            width=120
        )

        return yaml_str

    @staticmethod
    def validate_yaml(yaml_content: str) -> tuple[bool, str]:
        """
        Validate YAML content without raising exceptions.

        Args:
            yaml_content: YAML string content

        Returns:
            tuple[bool, str]: (is_valid, error_message)
        """
        try:
            YAMLService.parse_yaml(yaml_content)
            return (True, "")
        except (ValueError, ValidationError) as e:
            return (False, str(e))

    @staticmethod
    def update_positions(
        yaml_content: str,
        position_updates: dict[str, dict[str, float]]
    ) -> str:
        """
        Update system positions in YAML content.

        Args:
            yaml_content: Original YAML string
            position_updates: Dict mapping system IDs to {x, y} positions

        Returns:
            str: Updated YAML string

        Raises:
            ValueError: If update fails
        """
        landscape = YAMLService.parse_yaml(yaml_content)

        # Update positions
        for system in landscape.systems:
            if system.id in position_updates:
                pos_data = position_updates[system.id]
                system.position.x = pos_data.get('x', system.position.x)
                system.position.y = pos_data.get('y', system.position.y)

        return YAMLService.serialize_to_yaml(landscape)
