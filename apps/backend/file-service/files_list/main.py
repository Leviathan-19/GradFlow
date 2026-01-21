from fastapi import FastAPI, HTTPException
from pathlib import Path
from typing import List, Dict, Optional
from filesystem import get_student_folder_path
from config import STUDENTS_PATH, STUDENT_SECTIONS

app = FastAPI(title="File Service - List Files")

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/files/list")
def list_files(
    lastname1: Optional[str] = None,
    lastname2: Optional[str] = None,
    name1: Optional[str] = None,
    name2: Optional[str] = None,
    section: Optional[str] = None
):
    """
    List files for professors/admins.
    Can list all students or filter by specific student and section.
    """
    try:
        files_list = []
        
        if lastname1 and lastname2 and name1 and name2:
            # List files for specific student
            student_path = get_student_folder_path(lastname1, lastname2, name1, name2)
            
            if not student_path.exists():
                raise HTTPException(status_code=404, detail="Student folder not found")
            
            if section:
                # List files in specific section
                if section not in STUDENT_SECTIONS:
                    raise HTTPException(
                        status_code=400,
                        detail=f"Invalid section. Must be one of: {', '.join(STUDENT_SECTIONS)}"
                    )
                section_path = student_path / section
                if section_path.exists():
                    for file_path in section_path.iterdir():
                        if file_path.is_file():
                            files_list.append({
                                "filename": file_path.name,
                                "path": str(file_path),
                                "section": section,
                                "student": f"{lastname1} {lastname2}, {name1} {name2}",
                                "size": file_path.stat().st_size
                            })
            else:
                # List all files in all sections
                for sec in STUDENT_SECTIONS:
                    section_path = student_path / sec
                    if section_path.exists():
                        for file_path in section_path.iterdir():
                            if file_path.is_file():
                                files_list.append({
                                    "filename": file_path.name,
                                    "path": str(file_path),
                                    "section": sec,
                                    "student": f"{lastname1} {lastname2}, {name1} {name2}",
                                    "size": file_path.stat().st_size
                                })
        else:
            # List all students' files
            if STUDENTS_PATH.exists():
                for student_folder in STUDENTS_PATH.iterdir():
                    if student_folder.is_dir():
                        student_name = student_folder.name
                        for sec in STUDENT_SECTIONS:
                            section_path = student_folder / sec
                            if section_path.exists():
                                for file_path in section_path.iterdir():
                                    if file_path.is_file():
                                        files_list.append({
                                            "filename": file_path.name,
                                            "path": str(file_path),
                                            "section": sec,
                                            "student": student_name.replace("_", " "),
                                            "size": file_path.stat().st_size
                                        })
        
        return {
            "status": "success",
            "count": len(files_list),
            "files": files_list
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3014)
