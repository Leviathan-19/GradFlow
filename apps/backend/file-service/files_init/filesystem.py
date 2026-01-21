from pathlib import Path
from config import BASE_PATH, STUDENTS_PATH, STUDENT_SECTIONS

def ensure_gradflow_root():
    """Ensure gradflow root folder exists at EC2 root"""
    BASE_PATH.mkdir(parents=True, exist_ok=True)
    return BASE_PATH

def create_student_folder(lastname1: str, lastname2: str, name1: str, name2: str) -> Path:
    """
    Create student folder structure: lastname1_lastname2_name1_name2
    Inside: 4 section folders
    """
    # Ensure gradflow root exists
    ensure_gradflow_root()
    
    # Create folder name from student names
    folder_name = f"{lastname1}_{lastname2}_{name1}_{name2}"
    student_dir = STUDENTS_PATH / folder_name
    student_dir.mkdir(parents=True, exist_ok=True)
    
    # Create section folders inside
    for section in STUDENT_SECTIONS:
        (student_dir / section).mkdir(exist_ok=True)
    
    return student_dir
