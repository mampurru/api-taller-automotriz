# API REST por Capas – Taller Automotriz

API REST en **Node.js + Express** para gestionar los turnos de servicio de un taller automotriz. Está organizada en capas (routes, controllers, services) y responde con los códigos HTTP 200, 201, 400 y 404.

---

## 1. Integrantes del equipo (orden alfabético por apellido)

| # | Apellidos y nombres | N.º de lista oficial |
|---|---------------------|----------------------|
| 1 | Colorado Sanchez Oscar Andres  | 5  |
| 2 | Romero Gonzalez Juan David     | 18 |
| 3 | Toro Labarca Cesar Enrique     | 21 |

*Listado oficial: Arquitectura de Software – Grupo 1 martes.*

## 2. Parámetro N y porcentaje de recargo

- **N = 5** (número de lista de Colorado Sanchez Oscar Andres, primer integrante en orden alfabético)
- **porcentajeRecargo = N × 2% = 5 × 2% = 10%**

El valor de N está definido en `services/turnos.service.js`.

---

## 3. Descripción del negocio

**Taller Automotriz "AutoServicio Express"** es un taller mecánico que hace mantenimiento preventivo y correctivo a vehículos particulares. Los clientes piden un turno para llevar su vehículo y recibir uno de estos servicios:

- Cambio de aceite
- Alineación y balanceo
- Revisión de frenos
- Diagnóstico electrónico
- Mantenimiento general
- Latonería y pintura

Si el cliente necesita su vehículo con urgencia, puede pedir **atención prioritaria**: el taller lo atiende antes que a los demás y le cobra un recargo sobre el precio base.

### Datos de un turno

| Campo          | Tipo     | Obligatorio | Descripción                                        |
|----------------|----------|-------------|----------------------------------------------------|
| `cliente`      | texto    | Sí          | Nombre del cliente                                 |
| `placa`        | texto    | Sí          | Placa del vehículo (se guarda en mayúsculas)       |
| `vehiculo`     | texto    | Sí          | Marca, modelo y año                                |
| `tipoServicio` | texto    | Sí          | Uno de los servicios de la lista anterior (sin tildes) |
| `fecha`        | texto    | Sí          | Fecha y hora del turno, ej. `2026-11-28T09:00`      |
| `precioBase`   | número   | Sí          | Valor del servicio en pesos, mayor a 0             |
| `prioritario`  | booleano | No          | `true` si requiere atención prioritaria            |

La API agrega automáticamente: `id`, `porcentajeRecargo` y `totalPagar`.

### Regla de negocio

```
Si prioritario = true:
    totalPagar = precioBase + (precioBase × porcentajeRecargo / 100)
Si prioritario = false o no se envía:
    totalPagar = precioBase
```

Ejemplo con N = 5: un servicio prioritario de $150.000 → 150.000 + (150.000 × 10 / 100) = 150.000 + 15.000 = **$165.000**.

---

## 4. Estructura del proyecto (arquitectura por capas)

```
├── index.js                          # Inicia Express, middlewares, conecta rutas y levanta el servidor
├── routes/
│   └── turnos.routes.js              # Solo define endpoints y los asocia al controlador
├── controllers/
│   └── turnos.controller.js          # Maneja req/res, valida datos y asigna códigos HTTP
└── services/
    └── turnos.service.js             # Lógica de negocio, cálculo de tarifa y datos en memoria
```

**Flujo de una petición:** `Cliente → routes → controllers → services → controllers → Cliente`

---

## 5. Instalación y ejecución

```bash
npm install
npm start
```

El servidor queda en `http://localhost:3000`.

---

## 6. Endpoints

| Método | Ruta              | Descripción                       | Códigos  |
|--------|-------------------|-----------------------------------|----------|
| GET    | `/api/turnos`     | Lista todos los turnos            | 200      |
| GET    | `/api/turnos/:id` | Obtiene un turno por su id        | 200, 404 |
| POST   | `/api/turnos`     | Registra un nuevo turno           | 201, 400 |
| PUT    | `/api/turnos/:id` | Actualiza un turno (extra)        | 200, 400, 404 |

> El `PUT` es un endpoint adicional a los mínimos requeridos. Recibe el turno completo (los mismos campos y validaciones del `POST`), conserva el `id` y **vuelve a calcular el `totalPagar`** por si cambió el precio o la prioridad.

---

## 7. Ejemplos de prueba del POST `/api/turnos`

### ✅ Caso exitoso – 201 Created

**Petición:**
```json
{
  "cliente": "Andrés Pérez",
  "placa": "klm456",
  "vehiculo": "Renault Logan 2019",
  "tipoServicio": "alineacion y balanceo",
  "fecha": "2026-11-28T09:00",
  "precioBase": 150000,
  "prioritario": true
}
```

**Respuesta obtenida (201):**
```json
{
  "id": 3,
  "cliente": "Andrés Pérez",
  "placa": "KLM456",
  "vehiculo": "Renault Logan 2019",
  "tipoServicio": "alineacion y balanceo",
  "fecha": "2026-11-28T09:00",
  "precioBase": 150000,
  "prioritario": true,
  "porcentajeRecargo": 10,
  "totalPagar": 165000
}
```

### ❌ Caso de error de validación – 400 Bad Request

**Petición:**
```json
{
  "cliente": "",
  "placa": "KLM456",
  "tipoServicio": "cambio de aceite",
  "fecha": "2026-11-28T09:00",
  "precioBase": -5000
}
```

**Respuesta obtenida (400):**
```json
{
  "error": "Datos inválidos",
  "detalles": [
    "El campo \"cliente\" es obligatorio",
    "El campo \"vehiculo\" es obligatorio",
    "El campo \"precioBase\" debe ser mayor a cero"
  ]
}
```

### ✏️ Actualización – PUT `/api/turnos/1` → 200 OK

**Petición:**
```json
{
  "cliente": "Carlos Ramírez",
  "placa": "ABC123",
  "vehiculo": "Chevrolet Spark 2018",
  "tipoServicio": "cambio de aceite",
  "fecha": "2026-11-26T08:00",
  "precioBase": 130000,
  "prioritario": true
}
```

**Respuesta obtenida (200):** el mismo turno con `"id": 1`, `"porcentajeRecargo": 10` y `"totalPagar": 143000`. Si el id no existe responde 404, y si los datos son inválidos responde 400.

### 🔍 Consulta de id inexistente – 404 Not Found

`GET /api/turnos/99`

```json
{ "error": "No existe un turno con id 99" }
```
