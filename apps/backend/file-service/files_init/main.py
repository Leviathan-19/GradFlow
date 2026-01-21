from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from filesystem import create_student_folder, ensure_gradflow_root
from config import STUDENT_ROLE_ID

# Note: config.py and filesystem.py should be in the same directory

app = FastAPI(title="File Service - Init Student Folders")

class InitStudentRequest(BaseModel):
    lastname1: str
    lastname2: str
    name1: str
    name2: str
    rol_id: str
    user_id: str

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/files/init-student")
def init_student_folder(request: InitStudentRequest):
    """
    Initialize student folder structure.
    Only creates folder if user has student role.
    """
    try:
        # Verify role is student
        if request.rol_id != STUDENT_ROLE_ID:
            return {
                "status": "skipped",
                "message": "User is not a student, folder structure not created"
            }
        
        # Ensure gradflow root exists
        ensure_gradflow_root()
        
        # Create student folder structure
        student_path = create_student_folder(
            lastname1=request.lastname1,
            lastname2=request.lastname2,
            name1=request.name1,
            name2=request.name2
        )
        
        return {
            "status": "success",
            "message": "Student folder structure created",
            "path": str(student_path),
            "user_id": request.user_id
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3011)
