# API Cuenta Bancaria

API REST para gestionar cuentas bancarias: apertura, consignaciones, retiros, historial de movimientos y cierre de cuenta.
Construida con **Node.js, Express 5 y MongoDB (Mongoose)** siguiendo una arquitectura por capas.

## Requisitos

- Node.js 20 o superior
- MongoDB (local o Atlas)

## Instalación y ejecución

```bash
npm install
cp .env.example .env     # en Windows: copy .env.example .env  (y edita MONGO_URI)
npm run dev              # desarrollo con recarga automática
npm start                # producción
npm test                 # pruebas (no requieren base de datos)
```

## Variables de entorno

| Variable      | Descripción                                    | Ejemplo                                      |
| ------------- | ---------------------------------------------- | -------------------------------------------- |
| `PORT`        | Puerto del servidor (por defecto 3000)         | `3000`                                       |
| `MONGO_URI`   | Cadena de conexión a MongoDB (**obligatoria**) | `mongodb://127.0.0.1:27017/cuenta_bancaria`  |
| `CORS_ORIGEN` | Orígenes permitidos, separados por coma        | `https://miapp.com`                          |

## Endpoints

Base: `/api/cuentas`

| Método   | Ruta                  | Descripción                                          |
| -------- | --------------------- | ---------------------------------------------------- |
| `POST`   | `/`                   | Abrir cuenta                                         |
| `GET`    | `/`                   | Listar cuentas (`?pagina=1&limite=20&incluirCerradas=true`) |
| `GET`    | `/:id`                | Consultar una cuenta                                 |
| `PUT`    | `/:id`                | Cambiar el nombre del titular                        |
| `DELETE` | `/:id`                | Cerrar la cuenta (requiere saldo 0)                  |
| `POST`   | `/:id/consignar`      | Consignar dinero                                     |
| `POST`   | `/:id/retirar`        | Retirar dinero                                       |
| `GET`    | `/:id/movimientos`    | Historial paginado, del más reciente al más antiguo  |
| `GET`    | `/salud`              | Verificación de estado del servicio (fuera de `/api`) |

### Ejemplos

```bash
# Abrir cuenta
curl -X POST http://localhost:3000/api/cuentas \
  -H "Content-Type: application/json" \
  -d '{"nroCuenta":"402","nombreCliente":"Juan Pérez","saldo":100}'

# Consignar
curl -X POST http://localhost:3000/api/cuentas/<id>/consignar \
  -H "Content-Type: application/json" \
  -d '{"monto":50.50,"descripcion":"Pago de arriendo"}'

# Retirar
curl -X POST http://localhost:3000/api/cuentas/<id>/retirar \
  -H "Content-Type: application/json" \
  -d '{"monto":20}'
```

### Formato de errores

Todos los errores usan la misma estructura, con un `codigo` estable para que el cliente pueda reaccionar:

```json
{ "error": { "codigo": "SALDO_INSUFICIENTE", "mensaje": "Saldo insuficiente para realizar el retiro" } }
```

| HTTP | Código                                   | Cuándo                                      |
| ---- | ---------------------------------------- | ------------------------------------------- |
| 400  | `VALIDACION`, `JSON_INVALIDO`            | Datos o id mal formados                     |
| 404  | `NO_ENCONTRADO`                          | La cuenta no existe                         |
| 409  | `CONFLICTO`                              | Número de cuenta duplicado                  |
| 422  | `SALDO_INSUFICIENTE`, `CUENTA_CERRADA`, `SALDO_PENDIENTE` | Regla de negocio incumplida |
| 429  | —                                        | Demasiadas peticiones (100 por minuto)      |

## Reglas de negocio

- El saldo **solo cambia** con consignar o retirar; `PUT` no permite tocarlo.
- Montos mayores a 0 y con máximo 2 decimales.
- No se puede retirar más del saldo disponible.
- Las cuentas no se eliminan: se **cierran** (solo con saldo 0) y su historial se conserva.
- Una cuenta cerrada no admite operaciones.
- Cada operación queda registrada en el historial con el saldo resultante.

## Decisiones de diseño

- **Dinero en centavos enteros.** Internamente se guarda como entero para evitar errores de punto flotante; la API habla en pesos.
- **Operaciones atómicas.** Consignar y retirar usan `$inc` con condiciones dentro de la misma operación de MongoDB, así dos peticiones simultáneas no corrompen el saldo ni dejan la cuenta en negativo.
- **Arquitectura por capas** (`domain` → `application` → `infrastructure` → `interfaces`). Los casos de uso reciben los repositorios por inyección, por eso se prueban con repositorios en memoria. Solo `src/app.js` conecta las piezas reales.
- **Seguridad básica:** `helmet`, CORS configurable, límite de tamaño del cuerpo y límite de peticiones.

## Estructura

```
src/
├── app.js                    # arranque y ensamblado
├── config/                   # variables de entorno y conexión a MongoDB
├── domain/                   # errores, manejo de dinero, tipos (sin dependencias externas)
├── application/              # casos de uso y validaciones
├── infrastructure/
│   ├── persistence/mongo/    # modelos y repositorios Mongoose
│   └── http/                 # controladores, rutas, middlewares, presentadores
└── interfaces/server.js      # configuración de Express
test/                         # pruebas con node:test
```

## Mejoras futuras

- Registrar saldo y movimiento en una **transacción** de MongoDB (requiere replica set; Atlas ya lo trae).
- Autenticación (JWT) y que cada cliente solo vea sus cuentas.
- Transferencias entre cuentas y clave de idempotencia para reintentos seguros.
- Documentación OpenAPI/Swagger.
