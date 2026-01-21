# Endpoints Necesarios para el Sistema BPM de Titulación

## Endpoints de Autenticación ✅ (Ya implementados)

### 1. POST /auth/login
- **Descripción**: Login de usuario
- **Request**: `{ email, password }`
- **Response**: `{ token, user: { id, name1, name2, lastname1, lastname2, email, rol, rol_id } }`
- **Status**: ✅ Funcional

### 2. GET /auth/me
- **Descripción**: Obtener información del usuario autenticado
- **Headers**: `Authorization: Bearer {token}`
- **Response**: `{ id, name1, name2, lastname1, lastname2, email, rol, rol_id, status }`
- **Status**: ✅ Funcional (corregido)

### 3. GET /auth/roles
- **Descripción**: Listar todos los roles disponibles
- **Response**: `[{ id, name }, ...]`
- **Status**: ✅ Funcional

---

## Endpoints de Usuarios ✅ (Ya implementados)

### 4. GET /users
- **Descripción**: Listar todos los usuarios
- **Headers**: `Authorization: Bearer {token}`
- **Query Params**: Opcionales para filtrado
- **Status**: ✅ Funcional

### 5. GET /users/search
- **Descripción**: Buscar usuarios
- **Query Params**: `q` (query de búsqueda)
- **Status**: ✅ Funcional

### 6. POST /users
- **Descripción**: Crear nuevo usuario
- **Request**: `{ name1, name2, lastname1, lastname2, email, password, degree, telephone_number, rol_id }`
- **Status**: ✅ Funcional

### 7. PUT /users/:id
- **Descripción**: Actualizar usuario
- **Request**: `{ name1, name2, lastname1, lastname2, email, degree, telephone_number, rol_id, status }`
- **Status**: ✅ Funcional

### 8. DELETE /users/:id
- **Descripción**: Eliminar usuario
- **Status**: ✅ Funcional

---

## Endpoints de File Service ✅ (Ya implementados)

### 9. POST /files/init-student
- **Descripción**: Inicializar estructura de carpetas para estudiante
- **Request**: `{ lastname1, lastname2, name1, name2, rol_id, user_id }`
- **Status**: ✅ Funcional

### 10. PUT /files/update-student-folder
- **Descripción**: Actualizar nombre de carpeta cuando cambian los nombres
- **Status**: ✅ Funcional

### 11. POST /files/upload
- **Descripción**: Subir archivo PDF a sección de estudiante
- **Form Data**: `{ lastname1, lastname2, name1, name2, section, file }`
- **Status**: ✅ Funcional

### 12. GET /files/list
- **Descripción**: Listar archivos (para profesores/admins)
- **Query Params**: `lastname1, lastname2, name1, name2, section` (opcionales)
- **Status**: ✅ Funcional

### 13. GET /files/download
- **Descripción**: Descargar archivo (para profesores/admins)
- **Query Params**: `lastname1, lastname2, name1, name2, section, filename`
- **Status**: ✅ Funcional

---

## Endpoints Adicionales Recomendados (NO implementados aún)

### 14. DELETE /files/delete
- **Descripción**: Eliminar archivo
- **Request**: `{ lastname1, lastname2, name1, name2, section, filename }`
- **Auth**: Solo el estudiante propietario o admin/profesor
- **Prioridad**: 🔴 Alta

### 15. GET /files/info/:filename
- **Descripción**: Obtener información/metadatos de un archivo
- **Response**: `{ filename, size, uploaded_at, section, student }`
- **Prioridad**: 🟡 Media

### 16. POST /files/approve
- **Descripción**: Aprobar documento (permite avanzar a siguiente sección)
- **Request**: `{ lastname1, lastname2, name1, name2, section, filename, approved_by }`
- **Auth**: Solo admin/profesor
- **Prioridad**: 🔴 Alta

### 17. POST /files/reject
- **Descripción**: Rechazar documento con comentarios
- **Request**: `{ lastname1, lastname2, name1, name2, section, filename, comments, rejected_by }`
- **Auth**: Solo admin/profesor
- **Prioridad**: 🔴 Alta

### 18. GET /students/:id/progress
- **Descripción**: Obtener progreso del estudiante en todas las secciones
- **Response**: `{ student_id, sections: [{ section, status, files_count, approved_count }] }`
- **Prioridad**: 🔴 Alta

### 19. GET /students/:id/documents
- **Descripción**: Listar todos los documentos del estudiante con su estado
- **Response**: `[{ section, filename, status, uploaded_at, approved_at, comments }]`
- **Prioridad**: 🔴 Alta

### 20. PUT /students/:id/section/:section/status
- **Descripción**: Actualizar estado de una sección (completada, en progreso, bloqueada)
- **Request**: `{ status, comments }`
- **Auth**: Solo admin/profesor
- **Prioridad**: 🟡 Media

### 21. GET /professors/students
- **Descripción**: Listar todos los estudiantes asignados a un profesor
- **Auth**: Solo profesor/admin
- **Prioridad**: 🟢 Baja

### 22. POST /notifications
- **Descripción**: Enviar notificación al estudiante (documento aprobado/rechazado)
- **Request**: `{ user_id, message, type }`
- **Prioridad**: 🟡 Media

### 23. GET /notifications/:user_id
- **Descripción**: Obtener notificaciones del usuario
- **Response**: `[{ id, message, type, created_at, read }]`
- **Prioridad**: 🟡 Media

### 24. PUT /notifications/:id/read
- **Descripción**: Marcar notificación como leída
- **Prioridad**: 🟡 Media

### 25. GET /dashboard/stats
- **Descripción**: Estadísticas del dashboard (para admin/profesor)
- **Response**: `{ total_students, active_students, documents_pending, documents_approved }`
- **Prioridad**: 🟢 Baja

### 26. GET /students/search
- **Descripción**: Buscar estudiantes por nombre, email, degree, etc.
- **Query Params**: `q, degree, status`
- **Prioridad**: 🟡 Media

### 27. POST /students/:id/assign-professor
- **Descripción**: Asignar profesor/tutor a estudiante
- **Request**: `{ professor_id }`
- **Auth**: Solo admin
- **Prioridad**: 🟢 Baja

---

## Endpoints de Validación de Roles

### 28. GET /auth/check-role/:role
- **Descripción**: Verificar si el usuario autenticado tiene un rol específico
- **Response**: `{ hasRole: boolean, role: string }`
- **Prioridad**: 🟡 Media (puede hacerse en frontend también)

---

## Resumen por Prioridad

### 🔴 Alta Prioridad (Esenciales para MVP)
- DELETE /files/delete
- POST /files/approve
- POST /files/reject
- GET /students/:id/progress
- GET /students/:id/documents

### 🟡 Media Prioridad (Mejoras importantes)
- GET /files/info/:filename
- PUT /students/:id/section/:section/status
- POST /notifications
- GET /notifications/:user_id
- GET /students/search

### 🟢 Baja Prioridad (Nice to have)
- GET /professors/students
- GET /dashboard/stats
- POST /students/:id/assign-professor
- GET /auth/check-role/:role

---

## Notas de Implementación

1. **Autenticación**: Todos los endpoints (excepto login y listar roles) deben requerir token JWT
2. **Autorización**: Verificar roles antes de permitir acciones:
   - Estudiantes: Solo pueden ver/editar sus propios documentos
   - Profesores: Pueden ver/revisar documentos de sus estudiantes asignados
   - Admins: Acceso completo
3. **Validación**: Validar tipos de archivo (solo PDF), tamaños máximos
4. **Logging**: Registrar todas las aprobaciones/rechazos para auditoría
5. **Notifications**: Considerar implementar WebSockets para notificaciones en tiempo real
