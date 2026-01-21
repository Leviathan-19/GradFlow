from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from pathlib import Path
from filesystem import get_student_folder_path
from config import STUDENT_SECTIONS

app = FastAPI(title="File Service - Download Files")

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/files/download")
def download_file(
    lastname1: str,
    lastname2: str,
    name1: str,
    name2: str,
    section: str,
    filename: str
):
    """
    Download file for professors/admins.
    """
    try:
        # Validate section
        if section not in STUDENT_SECTIONS:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid section. Must be one of: {', '.join(STUDENT_SECTIONS)}"
            )
        
        # Get student folder path
        student_path = get_student_folder_path(lastname1, lastname2, name1, name2)
        
        if not student_path.exists():
            raise HTTPException(status_code=404, detail="Student folder not found")
        
        # File path
        file_path = student_path / section / filename
        
        if not file_path.exists():
            raise HTTPException(status_code=404, detail="File not found")
        
        if not file_path.is_file():
            raise HTTPException(status_code=400, detail="Path is not a file")
        
        return FileResponse(
            path=str(file_path),
            filename=filename,
            media_type="application/octet-stream"
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3015)
