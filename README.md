# Api Rest en Node.js

## Descripción

API REST para gestión de productos de Dionisio Wine Store desarrollada con Node.js y Express.

## Instalación

1. Clonar el repositorio
2. Instalar dependencias:

```bash
npm install
```

3. Configurar variables de entorno:

```bash
# Copiar el archivo de ejemplo y completar los datos requeridos
cp .env-example .env
```

Luego editar el archivo `.env` con los valores correspondientes para tu entorno.

4. Ejecutar en modo desarrollo:

```bash
npm run dev
```
## Deploy en Vercel
`proyecto-final-ecommerce-juan-scard.vercel.app`

## Documentación de la API

### Generación de un token de autorización

- **POST** `/login`
- **Descripción:** Devuelve un token para poder operar con rutas que implican modificación de la base de datos. Tales como agregar, modificar o borrar productos.
- **Uso del token:** Copiar el token que devuelve esta ruta SIN LAS COMILLAS, y agregarlo como el valor de un Bearer token en la ruta correspondiente. 
- **Respuesta ejemplo:**

```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxfSwiaWF0IjoxNzUzMzk3OTE3LCJleHAiOjE3NTM0MDE1MTd9._2XzELykhoCeL4HlDXiUdDr31jS3ucQkpVMWKtYnsLA"
}
```

### Obtener todos los productos

- **GET** `/api/products`
- **Descripción:** Devuelve la lista de todos los productos. No requiere autorización.
- **Respuesta ejemplo:**

```json
[
    {
        "id": "8drW2I4n6pKwVilH2uSo",
        "price": 6500,
        "categories": "Malbec",
        "stock": 10,
        "name": "Uxmal"
    },
    {
        "id": "9fAwkkThHfXwhLDjJ8D4",
        "price": 16000,
        "categories": "Malbec",
        "name": "Rutini",
        "stock": 30
    },
    {
        "id": "YGbGtkeepWyThhXMhQFO",
        "name": "Las Perdices",
        "price": 7000,
        "stock": 10,
        "categories": "Malbec"
    },
]
```

### Buscar productos por nombre (en desarrollo). 

- **GET** `/api/products/search?name=palabra`
- **Descripción:** Devuelve los productos cuyo nombre contiene la palabra indicada. No requiere autorización.
- **Parámetros:**
  - `name` (query, requerido): texto a buscar en el nombre del producto.
- **Ejemplo de uso:** `/products/search?name=rutini`
- **Respuesta ejemplo:**

```json
[    {
        "id": "9fAwkkThHfXwhLDjJ8D4",
        "price": 16000,
        "categories": "Malbec",
        "name": "Rutini",
        "stock": 30
    }
]
```

### Obtener producto por ID

- **GET** `/api/products/:id`
- **Descripción:** Devuelve un producto específico por su ID. No requiere autorización.
- **Parámetros:**
  - `id` (path, requerido): ID del producto.
- **Ejemplo de uso:** `/products/8drW2I4n6pKwVilH2uSo`
- **Respuesta ejemplo:**

```json
    {
        "id": "8drW2I4n6pKwVilH2uSo",
        "price": 6500,
        "categories": "Malbec",
        "stock": 10,
        "name": "Uxmal"
    }
```

### Crear un producto

- **POST** `/api/products`
- **Descripción:** Crea un nuevo producto. Requiere token de autorización.
- **Body (JSON):**

```json
    {
        "price": 6500,
        "categories": "Malbec",
        "stock": 10,
        "name": "Uxmal"
    }
```

- **Respuesta ejemplo:**

```json
    {
        "id": "8drW2I4n6pKwVilH2uSo",
        "price": 6500,
        "categories": "Malbec",
        "stock": 10,
        "name": "Uxmal"
    }
```

### Actualizar un producto (PUT)

- **PUT** `/api/products/:id`
- **Descripción:** Actualiza completamente un producto existente. Requiere token de autorización.
- **Validaciones:**
  - Chequea datos vacíos o inválidos
  - No admite precio ni stock negativo 
- **Parámetros:**
  - `id` (path, requerido): ID del producto a actualizar.
- **Body (JSON):**

```json
    {
        "price": 6500,
        "categories": "Malbec",
        "stock": 20,
        "name": "Uxmal"
    }
```

- **Respuesta ejemplo:**

```json
    {
        "id": "8drW2I4n6pKwVilH2uSo",
        "price": 6500,
        "categories": "Malbec",
        "stock": 20,
        "name": "Uxmal"
    }
```

### Actualizar parcialmente un producto (PATCH) (en desarrollo)

- **PATCH** `/api/products/:id`
- **Descripción:** Actualiza parcialmente un producto existente. Requiere token de autorización.
- **Parámetros:**
  - `id` (path, requerido): ID del producto a actualizar.
- **Body (JSON):** Solo los campos que se desean actualizar

```json
{ "price": 6100 }
```

- **Respuesta ejemplo:**

```json
    {
        "price": 6100,
        "categories": "Malbec",
        "stock": 20,
        "name": "Uxmal"
    }
```

### Eliminar un producto

- **DELETE** `/api/products/:id`
- **Descripción:** Elimina un producto por su ID. Requiere token de autorización.
- **Parámetros:**
  - `id` (path, requerido): ID del producto a eliminar.
- **Respuesta:** 204 No Content

## Códigos de estado

- `200` - OK: Operación exitosa
- `201` - Created: Recurso creado exitosamente
- `204` - No Content: Recurso eliminado exitosamente
- `400` - Bad Request: Datos de entrada inválidos
- `404` - Not Found: Recurso no encontrado

## Estructura del proyecto

```
src/
├── controllers/
│   ├── products.controller.js
│   └── auth.controller.js
├── models/
│   ├── data.js
│   └── products.model.js
├── middlewares/
│   └── auth.middleware.js
├── services/
│   └── product.service.js
└── routes/
    ├── auth.router.js
    └── products.router.js
```

## Tecnologías utilizadas

- Node.js
- Express.js
- ES6 Modules
- JWT
