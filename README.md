# Alisado Shop BE

API REST para una tienda, construida con **Node.js + Express** y **MongoDB (Mongoose)**.
Usando Modules

## Stack

- Node.js
- Express
- Mongoose
- bcrypt (hash de contraseñas)
- jsonwebtoken (autenticación JWT)
- cors

## Requisitos

- Node.js 20+
- Una base de datos MongoDB

## Instalación

```bash
npm install
```

## Variables de entorno

Crear un archivo `.env` en la raíz con:

```env
PORT=9000
MONGODB_URI=mongodb://...
SECRET_JWT=tu_clave_secreta
```

## Ejecutar

```bash
npm start
```

El script usa `node --env-file=.env --watch index.js` (recarga automática en desarrollo).
El servidor se levanta en `PORT` (por defecto `9000`) una vez conectada la base de datos.

## Estructura del proyecto

```
index.js                         # Punto de entrada: Express, conexión a DB y rutas
src/
  config/
    db.js                        # Conexión a MongoDB
  routes/
    routes.js                    # Registra todos los routers
    auth.js                      # Rutas de autenticación
    categories.js                # Rutas de categorías
    products.js                  # Rutas de productos
  controller/
    auth/
      register.js                # Registro de usuario
      login.js                   # Login + emisión de JWT
    categories/                  # create, delete, get, getAll (implementados)
    products/                    # create, delete, get, getAll, update (implementados)
  models/
    user.js                      # Esquema de usuario
    category.js                  # Esquema de categoría
    products.js                  # Esquema de producto
  middleware/
    auth.js                      # Verifica el JWT (Bearer token)
  helpers/
    classes/
      HttpError.js               # Error con status HTTP
    functions/
      hashPassword.js            # Hash de contraseña con bcrypt (12 rounds)
      validateEmail.js           # Validación de email por regex
  services/                      # (vacíos) capa de servicios
```

## Modelo `User`

| Campo      | Tipo   | Reglas                                              |
|------------|--------|-----------------------------------------------------|
| `name`     | String | Requerido                                           |
| `email`    | String | Requerido, único, validado con regex                |
| `password` | String | Requerido (se guarda hasheado)                      |

## Modelo `Category`

| Campo          | Tipo   | Reglas                          |
|----------------|--------|---------------------------------|
| `name`         | String | Requerido, único                |
| `description`  | String | Requerido                       |
| `productCount` | Number | Cantidad de productos asociados (default `0`) |

`productCount` se guarda en la base y se mantiene actualizado al crear, eliminar o cambiar de categoría un producto (y se recalcula al correr `seed.js`).

## Endpoints implementados

### Autenticación

| Método | Ruta        | Descripción                          |
|--------|-------------|--------------------------------------|
| POST   | `/register` | Registra un usuario (hash de pass)   |
| POST   | `/login`    | Inicia sesión y devuelve un JWT      |

#### `POST /register`

**Request**

```json
{
  "name": "Prueba",
  "email": "testmail@mail.com",
  "password": "123456789.aA"
}
```

**Response `201`**

```json
{
  "message": "El usuario Prueba se registro exitosamente"
}
```

- Valida que el email no esté en uso.
- Hashea la contraseña con bcrypt (12 rounds).
- Responde `409` si el email ya está en uso.

#### `POST /login`

**Request**

```json
{
  "email": "testmail@mail.com",
  "password": "123456789.aA"
}
```

**Response `200`**

```json
{
  "token": "<jwt>",
  "user": {
    "id": "<id>",
    "email": "testmail@mail.com"
  }
}
```

- Busca el usuario por email y compara la contraseña con bcrypt.
- El token expira en `2h` y se firma con `SECRET_JWT`.
- Responde `401` con `Credenciales inválidas` si el email o la contraseña no coinciden.

### Categorías

Todas las rutas requieren autenticación (`Authorization: Bearer <token>`).

| Método | Ruta                | Descripción                              |
|--------|---------------------|------------------------------------------|
| POST   | `/categories`       | Crea una categoría                        |
| DELETE | `/categories/:name` | Elimina una categoría por nombre          |
| GET    | `/categories/all`   | Lista todas las categorías                |
| GET    | `/categories/:name` | Obtiene una categoría por nombre          |

#### `POST /categories`

**Request**

```
POST /categories
Authorization: Bearer <token>
```

```json
{
  "name": "Tirri",
  "description": "Categoría de prueba"
}
```

**Response `201`**

```json
{
  "message": "La categoria fue registrada"
}
```

- Responde `500` con el mensaje del error de validación (ej. nombre duplicado o faltante).

#### `DELETE /categories/:name`

**Request**

```
DELETE /categories/Tirri
Authorization: Bearer <token>
```

**Response `201`**

```json
{
  "message": "La categoria fue eliminada correctamente"
}
```

- Elimina la categoría cuyo `name` coincide con el parámetro de ruta.
- Responde `404` si la categoría no existe.

#### `GET /categories/all`

**Request**

```
GET /categories/all
Authorization: Bearer <token>
```

**Response `200`**

```json
[
  {
    "_id": "6af264182d7d359ccb3e5761",
    "name": "Alisados Permanentes",
    "description": "Tratamientos de alisado de larga duración con keratina y fórmulas profesionales.",
    "productCount": 3,
    "__v": 0
  },
  {
    "_id": "6af264182d7d359ccb3e5762",
    "name": "Kits de Alisado",
    "description": "Combos completos de alisado y mantenimiento a precio promocional.",
    "productCount": 2,
    "__v": 0
  }
]
```

#### `GET /categories/:name`

**Request**

```
GET /categories/Alisados Permanentes
Authorization: Bearer <token>
```

**Response `200`**

```json
{
  "_id": "6af264182d7d359ccb3e5761",
  "name": "Alisados Permanentes",
  "description": "Tratamientos de alisado de larga duración con keratina y fórmulas profesionales.",
  "productCount": 3,
  "__v": 0
}
```

- Responde `404` si no existe.

### Productos

| Método | Ruta             | Descripción                                   |
|--------|------------------|-----------------------------------------------|
| POST   | `/product`       | Crea un producto                              |
| PUT    | `/product/:id`   | Actualiza parcialmente un producto por id     |
| DELETE | `/product/:id`   | Elimina un producto por id                    |
| GET    | `/product/all`   | Lista todos los productos                     |
| GET    | `/product/:id`   | Obtiene un producto por id                    |

#### `POST /product`

**Request**

```json
{
  "name": "Alisado Permanente Keratina Premium",
  "description": "Tratamiento de keratina profesional con efecto liso hasta por 4 meses.",
  "price": 28999,
  "stock": 25,
  "category": "Alisados Permanentes"
}
```

**Response `201`**

```json
{
  "_id": "6af264182d7d359ccb3e5790",
  "name": "Alisado Permanente Keratina Premium",
  "description": "Tratamiento de keratina profesional con efecto liso hasta por 4 meses.",
  "price": 28999,
  "stock": 25,
  "category": "6af264182d7d359ccb3e5761",
  "__v": 0
}
```

- La categoría se referencia por **nombre**.
- Responde `404` si la categoría no existe.

#### `PUT /product/:id`

**Request**

```
PUT /product/6af264182d7d359ccb3e5790
```

```json
{
  "name": "Alisado Keratina Premium",
  "stock": 30
}
```

**Response `200`**

```json
{
  "_id": "6af264182d7d359ccb3e5790",
  "name": "Alisado Keratina Premium",
  "description": "Tratamiento de keratina profesional con efecto liso hasta por 4 meses.",
  "price": 28999,
  "stock": 30,
  "category": "6af264182d7d359ccb3e5761",
  "__v": 0
}
```

- Actualiza solo los campos enviados en el body (`name`, `description`, `price`, `stock`, `category`).
- Responde `400` si el id no es válido y `404` si el producto no existe.

#### `DELETE /product/:id`

**Request**

```
DELETE /product/6af264182d7d359ccb3e5790
```

**Response `201`**

```json
{
  "message": "La producto fue eliminado correctamente"
}
```

- Responde `404` si el producto no existe.

#### `GET /product/all`

**Request**

```
GET /product/all
```

**Response `200`**

```json
[
  {
    "_id": "6af264182d7d359ccb3e5790",
    "name": "Alisado Permanente Keratina Premium",
    "description": "Tratamiento de keratina profesional con efecto liso hasta por 4 meses.",
    "price": 28999,
    "stock": 25,
    "category": "6af264182d7d359ccb3e5761",
    "__v": 0
  }
]
```

#### `GET /product/:id`

**Request**

```
GET /product/6af264182d7d359ccb3e5790
```

**Response `200`**

```json
{
  "_id": "6af264182d7d359ccb3e5790",
  "name": "Alisado Permanente Keratina Premium",
  "description": "Tratamiento de keratina profesional con efecto liso hasta por 4 meses.",
  "price": 28999,
  "stock": 25,
  "category": "6af264182d7d359ccb3e5761",
  "__v": 0
}
```

- Responde `404` si no existe.

> Nota: las rutas de productos actualmente **no** están protegidas por el middleware `Auth`.

### Autenticación por JWT

El middleware `src/middleware/auth.js` protege las rutas de categorías. Lee el header:

```
Authorization: Bearer <token>
```

- Sin token: `401` `{ message: 'Sin token' }`.
- Token inválido o expirado: `401` `{ message: 'Token inválido' }`.
- Si es válido, deja el payload en `req.user` (`{ id, email, iat, exp }`) y llama a `next()`.

Se usa a nivel de ruta, por ejemplo en `src/routes/categories.js`:

```js
app.post('/categories', Auth, CreateCategoryController);
```

### Manejo de errores

`HttpError` (`src/helpers/classes/HttpError.js`) permite lanzar errores con su status HTTP:

```js
throw new HttpError(401, 'Credenciales inválidas');
```

Los controladores responden con `err.status || 500`.

## Pendiente / por implementar

- Capa de `services` (archivos vacíos).
- En `login.js`, el segundo `throw new HttpError('Credenciales inválidas')` no pasa el `status` (debería ser `new HttpError(401, ...)`).
