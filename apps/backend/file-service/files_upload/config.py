from pathlib import Path
import os

# Base path for GradFlow - root of EC2 instance
BASE_PATH = Path(os.getenv("FILE_BASE_PATH", "/gradflow"))
STUDENTS_PATH = BASE_PATH / "students"

# Student folder sections - can be customized
STUDENT_SECTIONS = [
    "seccion1",
    "seccion2", 
    "seccion3",
    "seccion4"
]

# Student role ID
STUDENT_ROLE_ID = "d70f1978-c472-4cba-a70f-432337f19e9f"
