from fastapi import UploadFile, File

@app.post("/students/{student_id}/{proceso}/upload")
async def upload_file(
    student_id: str,
    proceso: str,
    file: UploadFile = File(...)
):
    if not file.filename.endswith(".pdf"):
        return {"error": "Solo PDF permitido"}

    dest = STUDENTS_PATH / student_id / proceso / file.filename

    with open(dest, "wb") as f:
        f.write(await file.read())

    return {"status": "uploaded"}
