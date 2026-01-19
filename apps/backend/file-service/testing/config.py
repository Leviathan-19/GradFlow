from pathlib import Path
import os
from dotenv import load_dotenv
# Ubuntu: /home/ubuntu/gradflowtest
# Windows: D:\gradflowtest
load_dotenv() 

BASE_PATH = Path(os.getenv("FILE_BASE_PATH",r"/home/ubuntu/gradflowtest")) #Ubuntu
#BASE_PATH = Path(os.getenv("FILE_BASE_PATH",r"D:\gradflowtest")) #Windows
#BASE_PATH = Path(os.getenv("FILE_BASE_PATH",r"/opt/gradflowtest")) #Global
STUDENTS_PATH = BASE_PATH / "students"

