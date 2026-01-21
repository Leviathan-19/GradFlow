from pathlib import Path
from config import BASE_PATH, STUDENTS_PATH, STUDENT_SECTIONS

def ensure_gradflow_root():
    """Ensure gradflow root folder exists at EC2 root"""
    BASE_PATH.mkdir(parents=True, exist_ok=True)
    return BASE_PATH

def create_student_folder(lastname1: str, lastname2: str, name1: str, name2: str) -> Path:
    """Create student folder structure"""
    ensure_gradflow_root()
    folder_name = f"{lastname1}_{lastname2}_{name1}_{name2}"
    student_dir = STUDENTS_PATH / folder_name
    student_dir.mkdir(parents=True, exist_ok=True)
    
    for section in STUDENT_SECTIONS:
        (student_dir / section).mkdir(exist_ok=True)
    
    return student_dir

def update_student_folder(old_folder_name: str, new_lastname1: str, new_lastname2: str, 
                          new_name1: str, new_name2: str) -> Path:
    """Update/rename student folder when names change"""
    old_path = STUDENTS_PATH / old_folder_name
    
    if not old_path.exists():
        return create_student_folder(new_lastname1, new_lastname2, new_name1, new_name2)
    
    new_folder_name = f"{new_lastname1}_{new_lastname2}_{new_name1}_{new_name2}"
    new_path = STUDENTS_PATH / new_folder_name
    
    if old_folder_name != new_folder_name:
        old_path.rename(new_path)
        for section in STUDENT_SECTIONS:
            (new_path / section).mkdir(exist_ok=True)
    
    return new_path
