from pathlib import Path
from config import STUDENTS_PATH

def get_student_folder_path(lastname1: str, lastname2: str, name1: str, name2: str) -> Path:
    """Get the path to a student's folder"""
    folder_name = f"{lastname1}_{lastname2}_{name1}_{name2}"
    return STUDENTS_PATH / folder_name
