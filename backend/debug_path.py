import asyncio
import sys
from pathlib import Path
import uvicorn
from fastapi import FastAPI

sys.path.insert(0, str(Path(__file__).parent))

from app.config import settings
from app.services.file_service import FileService
from app.services.yaml_service import YAMLService

# Create a minimal FastAPI app for debugging
debug_app = FastAPI()

@debug_app.get("/test")
async def run_the_test():
    """
    This endpoint runs the logic that was proven to work in the script,
    but inside a real FastAPI request context.
    """
    print("--- Testing inside a FastAPI request ---")
    try:
        # 1. Test FileService instantiation
        file_service = FileService(str(settings.data_dir))
        print(f"FileService instantiated with data_dir: {file_service.data_dir}")

        # 2. Test listing landscapes (the likely source of the crash)
        landscapes_list = await file_service.list_landscapes()
        print(f"list_landscapes returned {len(landscapes_list)} items.")

        # 3. Test reading and merging a specific landscape
        yaml_content = await file_service.read_landscape("examples/sample-new-format")
        merged = YAMLService.get_merged_landscape(yaml_content)
        print(f"Successfully read and merged 'examples/sample-new-format'.")
        
        return {
            "success": True,
            "found_landscapes": len(landscapes_list),
            "merged_systems": len(merged.systems),
            "first_system": merged.systems[0].model_dump() if merged.systems else None,
        }

    except Exception as e:
        print(f"--- ERROR inside FastAPI request ---")
        import traceback
        traceback.print_exc()
        return {"success": False, "error": str(e)}

if __name__ == "__main__":
    print("Starting minimal debug server on http://localhost:8001")
    uvicorn.run(
        debug_app,
        host="0.0.0.0",
        port=8001,
        log_level="info"
    )
