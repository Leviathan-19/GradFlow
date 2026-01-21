# from fastapi import FastAPI
# from config import STUDENTS_PATH
# from filesystem import create_student_structure

# app = FastAPI()

# @app.post("/students/{student_id}/init")
# def init_student_folders(student_id: str):
#     path = create_student_structure(student_id, STUDENTS_PATH)
#     return {"status": "ok", "path": str(path)}


#-----------------------------------------------
from fastapi import FastAPI
from config import STUDENTS_PATH
from filesystem import create_student_structure

app = FastAPI()

@app.post("/students/{student_id}/init")
def init_student(student_id: str):
    path = create_student_structure(student_id, STUDENTS_PATH)
    return {"status": "ok", "path": str(path)}
#-----------------------------------------------