from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from pathlib import Path
from filesystem import get_student_folder_path
from config import STUDENT_SECTIONS

# Note: config.py and filesystem.py should be in the same directory

app = FastAPI(title="File Service - Upload Files")

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/files/upload")
async def upload_file(
    lastname1: str = Form(...),
    lastname2: str = Form(...),
    name1: str = Form(...),
    name2: str = Form(...),
    section: str = Form(...),
    file: UploadFile = File(...)
):
    """
    Upload file to student's section folder.
    Students can upload files to their own folders.
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
            raise HTTPException(
                status_code=404,
                detail="Student folder not found. Please initialize student folder first."
            )
        
        # Section folder path
        section_path = student_path / section
        
        # Save file
        file_path = section_path / file.filename
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)
        
        return {
            "status": "success",
            "message": "File uploaded successfully",
            "filename": file.filename,
            "path": str(file_path),
            "section": section
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3013)
