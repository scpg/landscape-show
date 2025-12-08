"""Service for YAML parsing and validation."""

import yaml
from typing import Any, List
from pydantic import ValidationError
from app.models.landscape import Landscape, System, SystemDefinition, MergedLandscape


class YAMLService:
    """Service for handling YAML operations."""

    @staticmethod
    def parse_yaml(yaml_content: str) -> Landscape:
        """
        Parse YAML content into a raw Landscape model with separated data.

        Args:
            yaml_content: YAML string content

        Returns:
            Landscape: Validated Landscape object with separated system data.

        Raises:
            ValueError: If YAML is invalid or doesn't match schema
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
    def get_merged_landscape(yaml_content: str) -> MergedLandscape:
        """
        Parses YAML and merges the separated system data (definition, style,
        position) into a unified list of System objects.

        This is the primary method for getting data ready for the frontend.

        Args:
            yaml_content: The YAML string content.

        Returns:
            MergedLandscape: A landscape object with a unified `systems` list.
        
        Raises:
            ValueError: If a system definition is missing a position.
        """
        raw_landscape = YAMLService.parse_yaml(yaml_content)
        
        styles = {s.id: s for s in raw_landscape.systems_styles}
        positions = {p.id: p for p in raw_landscape.systems_positions}

        merged_systems: List[System] = []
        for sys_def in raw_landscape.systems:
            sys_pos = positions.get(sys_def.id)
            if not sys_pos:
                raise ValueError(f"System '{sys_def.id}' is missing a position in 'systems-positions'.")

            sys_style = styles.get(sys_def.id)
            
            merged_system = System(
                id=sys_def.id,
                name=sys_def.name,
                type=sys_def.type,
                description=sys_def.description,
                owner=sys_def.owner,
                technology=sys_def.technology,
                position={'x': sys_pos.x, 'y': sys_pos.y},
                style={'color': sys_style.color, 'icon': sys_style.icon} if sys_style else None
            )
            merged_systems.append(merged_system)

        return MergedLandscape(
            metadata=raw_landscape.metadata,
            systems=merged_systems,
            connections=raw_landscape.connections,
            groups=raw_landscape.groups
        )

    @staticmethod
    def serialize_to_yaml(landscape: Landscape) -> str:
        """
        Serialize a Landscape model to YAML string.

        Args:
            landscape: Landscape object to serialize

        Returns:
            str: YAML formatted string
        """
        # Convert Pydantic model to dict with JSON-safe serialization
        # mode='json' ensures enums are converted to strings and datetime to ISO format
        data = landscape.model_dump(mode='json', by_alias=True, exclude_none=True)

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
        Update system positions in the `systems-positions` block of the YAML content.

        Args:
            yaml_content: Original YAML string
            position_updates: Dict mapping system IDs to {x, y} positions

        Returns:
            str: Updated YAML string

        Raises:
            ValueError: If update fails
        """
        landscape = YAMLService.parse_yaml(yaml_content)

        # Create a dictionary for easy lookup
        positions_dict = {pos.id: pos for pos in landscape.systems_positions}

        # Update positions
        for sys_id, new_pos_data in position_updates.items():
            if sys_id in positions_dict:
                positions_dict[sys_id].x = new_pos_data.get('x', positions_dict[sys_id].x)
                positions_dict[sys_id].y = new_pos_data.get('y', positions_dict[sys_id].y)
            else:
                # This case could happen if a system exists but has no entry in systems-positions yet
                # For now, we only update existing ones. To be robust, we could add a new one.
                pass 

        # The models are mutable, so the landscape object is now updated.
        return YAMLService.serialize_to_yaml(landscape)
