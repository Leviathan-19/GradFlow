from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from filesystem import update_student_folder
from config import STUDENT_ROLE_ID

# Note: config.py and filesystem.py should be in the same directory

app = FastAPI(title="File Service - Update Student Folders")

class UpdateStudentRequest(BaseModel):
    old_lastname1: str
    old_lastname2: str
    old_name1: str
    old_name2: str
    new_lastname1: str
    new_lastname2: str
    new_name1: str
    new_name2: str
    rol_id: str
    user_id: str

@app.get("/health")
def health():
    return {"status": "ok"}

@app.put("/files/update-student-folder")
def update_student_folder_name(request: UpdateStudentRequest):
    """
    Update student folder name when student names change.
    Only processes if user has student role.
    """
    try:
        # Verify role is student
        if request.rol_id != STUDENT_ROLE_ID:
            return {
                "status": "skipped",
                "message": "User is not a student, folder update skipped"
            }
        
        # Create old folder name
        old_folder_name = f"{request.old_lastname1}_{request.old_lastname2}_{request.old_name1}_{request.old_name2}"
        
        # Update folder structure
        new_path = update_student_folder(
            old_folder_name=old_folder_name,
            new_lastname1=request.new_lastname1,
            new_lastname2=request.new_lastname2,
            new_name1=request.new_name1,
            new_name2=request.new_name2
        )
        
        return {
            "status": "success",
            "message": "Student folder updated",
            "path": str(new_path),
            "user_id": request.user_id
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3012)
