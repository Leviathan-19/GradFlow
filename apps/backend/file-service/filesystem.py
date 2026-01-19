from pathlib import Path

PROCESOS = ["proceso1", "proceso2", "proceso3", "proceso4"]

def create_student_structure(student_id: str, base_path: Path):
    student_dir = base_path / student_id
    student_dir.mkdir(parents=True, exist_ok=True)

    for proceso in PROCESOS:
        (student_dir / proceso).mkdir(exist_ok=True)

    return student_dir
