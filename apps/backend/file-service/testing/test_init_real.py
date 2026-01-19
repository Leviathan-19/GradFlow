from config import STUDENTS_PATH
from filesystem import create_student_structure

def run_test():
    users = ["user1", "user2", "user3"]

    print(f"Creando carpeta principal en: {STUDENTS_PATH.parent}")
    STUDENTS_PATH.parent.mkdir(parents=True, exist_ok=True)

    for user in users:
        path = create_student_structure(user, STUDENTS_PATH)
        print(f"✔ Carpetas creadas para {user}: {path}")
    
    print("✅ Test completado. Verifica las carpetas en la ruta indicada.")

if __name__ == "__main__":
    run_test()
