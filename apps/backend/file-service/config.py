from pathlib import Path
import os

##BASE_PATH = Path(os.getenv("FILE_BASE_PATH", "/data/gradflow"))
##STUDENTS_PATH = BASE_PATH / "students"

#BASE_PATH = Path("./gradflowtest")
#STUDENTS_PATH = BASE_PATH / "students"

BASE_PATH = Path(os.getenv("FILE_BASE_PATH", "/tmp/gradflowdata"))
STUDENTS_PATH = BASE_PATH / "students"
