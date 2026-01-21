from pathlib import Path
import os
import platform

# Detect if running on Windows (local development) or Linux (EC2)
IS_WINDOWS = platform.system() == "Windows"

# Base path for GradFlow
if IS_WINDOWS:
    DEFAULT_BASE_PATH = Path(__file__).parent.parent.parent / "gradflow_data"
else:
    DEFAULT_BASE_PATH = Path("/gradflow")

BASE_PATH = Path(os.getenv("FILE_BASE_PATH", str(DEFAULT_BASE_PATH)))
STUDENTS_PATH = BASE_PATH / "students"

STUDENT_SECTIONS = [
    "seccion1",
    "seccion2", 
    "seccion3",
    "seccion4"
]

STUDENT_ROLE_ID = "d70f1978-c472-4cba-a70f-432337f19e9f"
