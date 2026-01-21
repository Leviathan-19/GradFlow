# File Service Domain

Este dominio está diseñado para crear y gestionar carpetas y subcarpetas para estudiantes en una instancia EC2 de AWS. Proporciona un sistema de repositorio en la nube donde los estudiantes pueden subir archivos y los profesores/administradores pueden visualizarlos o descargarlos.

## Estructura de Microservicios

El dominio está dividido en 5 microservicios independientes:

### 1. **files_init** (Puerto 3011)
- **Endpoint**: `POST /files/init-student`
- **Propósito**: Crea la estructura de carpetas para un nuevo estudiante
- **Cuándo se llama**: Después de crear un usuario con rol de estudiante
- **Estructura creada**: 
  - `/gradflow/students/{lastname1}_{lastname2}_{name1}_{name2}/`
  - Dentro: 4 carpetas de secciones (seccion1, seccion2, seccion3, seccion4)

### 2. **files_update** (Puerto 3012)
- **Endpoint**: `PUT /files/update-student-folder`
- **Propósito**: Actualiza el nombre de la carpeta cuando cambian los nombres del estudiante
- **Cuándo se llama**: Después de actualizar un usuario si los nombres (name1, name2, lastname1, lastname2) cambiaron

### 3. **files_upload** (Puerto 3013)
- **Endpoint**: `POST /files/upload`
- **Propósito**: Permite a los estudiantes subir archivos a sus carpetas de sección
- **Formato**: multipart/form-data
- **Parámetros**: lastname1, lastname2, name1, name2, section, file

### 4. **files_list** (Puerto 3014)
- **Endpoint**: `GET /files/list`
- **Propósito**: Lista archivos para profesores/administradores
- **Filtros opcionales**: lastname1, lastname2, name1, name2, section
- **Puede listar**: Todos los archivos o filtrar por estudiante/sección específica

### 5. **files_download** (Puerto 3015)
- **Endpoint**: `GET /files/download`
- **Propósito**: Descarga archivos para profesores/administradores
- **Parámetros requeridos**: lastname1, lastname2, name1, name2, section, filename

## Configuración

### Variables de Entorno

- `FILE_BASE_PATH`: Ruta base donde se crean las carpetas (default: `/gradflow`)
  - En producción, esto debe ser la raíz de la instancia EC2

### Estructura de Carpetas

```
/gradflow/                          # Carpeta raíz (se crea automáticamente)
└── students/                        # Carpeta de estudiantes
    └── {lastname1}_{lastname2}_{name1}_{name2}/  # Carpeta del estudiante
        ├── seccion1/                # Sección 1
        ├── seccion2/                # Sección 2
        ├── seccion3/                # Sección 3
        └── seccion4/                # Sección 4
```

### ID de Rol de Estudiante

- `STUDENT_ROLE_ID`: `d70f1978-c472-4cba-a70f-432337f19e9f`

## Integración con Usuarios

### Crear Usuario (users_create)

Después de crear un usuario exitosamente:
1. Si el usuario tiene rol de estudiante, se llama automáticamente a `files_init`
2. Se crea la estructura de carpetas con los nombres del estudiante

**Variables de entorno necesarias en users_create:**
- `FILE_SERVICE_URL`: URL del servicio files_init (default: `http://localhost:3011`)

### Actualizar Usuario (users_update)

Después de actualizar un usuario:
1. Si los nombres (name1, name2, lastname1, lastname2) cambian
2. Y el usuario tiene rol de estudiante
3. Se llama automáticamente a `files_update` para renombrar la carpeta

**Variables de entorno necesarias en users_update:**
- `FILE_SERVICE_UPDATE_URL`: URL del servicio files_update (default: `http://localhost:3012`)

## Endpoints Disponibles

### Inicializar Carpeta de Estudiante
```http
POST http://localhost:3011/files/init-student
Content-Type: application/json

{
  "lastname1": "Pérez",
  "lastname2": "García",
  "name1": "Juan",
  "name2": "Carlos",
  "rol_id": "d70f1978-c472-4cba-a70f-432337f19e9f",
  "user_id": "123e4567-e89b-12d3-a456-426614174000"
}
```

### Actualizar Carpeta de Estudiante
```http
PUT http://localhost:3012/files/update-student-folder
Content-Type: application/json

{
  "old_lastname1": "Pérez",
  "old_lastname2": "García",
  "old_name1": "Juan",
  "old_name2": "Carlos",
  "new_lastname1": "Pérez",
  "new_lastname2": "López",
  "new_name1": "Juan",
  "new_name2": "Carlos",
  "rol_id": "d70f1978-c472-4cba-a70f-432337f19e9f",
  "user_id": "123e4567-e89b-12d3-a456-426614174000"
}
```

### Subir Archivo
```http
POST http://localhost:3013/files/upload
Content-Type: multipart/form-data

lastname1: "Pérez"
lastname2: "García"
name1: "Juan"
name2: "Carlos"
section: "seccion1"
file: [archivo.pdf]
```

### Listar Archivos
```http
# Listar todos los archivos
GET http://localhost:3014/files/list

# Filtrar por estudiante
GET http://localhost:3014/files/list?lastname1=Pérez&lastname2=García&name1=Juan&name2=Carlos

# Filtrar por estudiante y sección
GET http://localhost:3014/files/list?lastname1=Pérez&lastname2=García&name1=Juan&name2=Carlos&section=seccion1
```

### Descargar Archivo
```http
GET http://localhost:3015/files/download?lastname1=Pérez&lastname2=García&name1=Juan&name2=Carlos&section=seccion1&filename=documento.pdf
```

## Docker

### Construir un microservicio individual
```bash
cd files_init
docker build -t files-init .
```

### Ejecutar todos los servicios con Docker Compose
```bash
docker-compose up -d
```

### Detener todos los servicios
```bash
docker-compose down
```

## Consideraciones Adicionales

### Endpoints que faltan (Recomendaciones)

1. **Eliminar archivo** - Para que los estudiantes puedan eliminar sus propios archivos
2. **Eliminar carpeta de estudiante** - Cuando se elimine un usuario/estudiante
3. **Autenticación/Autorización** - Agregar middleware para verificar roles
4. **Validación de tipos de archivo** - Restringir tipos de archivo permitidos
5. **Límites de tamaño** - Implementar límites de tamaño de archivo
6. **Compresión/descompresión** - Para múltiples archivos
7. **Búsqueda de archivos** - Búsqueda avanzada por nombre, fecha, etc.
8. **Metadatos de archivos** - Almacenar información adicional sobre los archivos
9. **Historial de versiones** - Si se requiere control de versiones
10. **Permisos granulares** - Control más fino sobre quién puede ver/editar qué

## Desarrollo Local

Para desarrollo local, asegúrate de:

1. Instalar dependencias en cada microservicio:
```bash
cd files_init
pip install -r requirements.txt
```

2. Configurar variables de entorno según sea necesario

3. Ejecutar los servicios:
```bash
python main.py
```

O usar uvicorn directamente:
```bash
uvicorn main:app --host 0.0.0.0 --port 3011
```
