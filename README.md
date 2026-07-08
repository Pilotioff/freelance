# FreelanceEstimator

Plataforma web SaaS para freelancers que automatiza la cotización de
proyectos de software mediante un motor de cálculo ponderado e inteligencia
artificial local (Llama vía Ollama).

## ¿Qué hace?

- Cotización manual en 4 pasos: tipo de proyecto, detalles técnicos,
  infraestructura y resumen con precio final en COP
- Cotización asistida por IA: sube un mockup (imagen) o un PDF con
  historias de usuario y la IA pre-llena el formulario automáticamente
- Dashboard con métricas, gráfica de historial y conversor de divisas
- Historial de cotizaciones con filtros por fecha y complejidad
- Panel de administración para ajustar los pesos del motor de cálculo
- Autenticación segura con JWT en cookie HTTP-only
- Modo de respaldo automático si MongoDB no responde

## Stack

| Capa | Tecnología |
|------|-----------|
| Backend | NestJS 10 + TypeScript |
| BD principal | PostgreSQL 15 + Prisma |
| BD usuarios | MongoDB 7 + Mongoose |
| Frontend | React 18 + Vite + Tailwind CSS |
| IA local | Llama 3.2 vía Ollama |
| Pruebas | Jest + Cypress + k6 |
| Calidad | SonarCloud |
| CI/CD | GitHub Actions + Docker (fase posterior) |

## Requisitos previos

- Node.js 20 LTS
- PostgreSQL 15 corriendo en localhost:5432
- MongoDB 7 corriendo en localhost:27017
- Ollama instalado con modelo llama3.2 (para el módulo de IA)

## Instalación y arranque

### 1. Clonar y entrar al proyecto
git clone <url-del-repo>
cd freeLance3.0

### 2. Configurar variables de entorno

Backend:
cd freelance-estimator-backend
copy .env.example .env
# Editar .env con tus credenciales reales de PostgreSQL y MongoDB

Frontend:
cd ../freelance-estimator-frontend
copy .env.example .env

### 3. Instalar dependencias

Backend:
cd freelance-estimator-backend
npm install

Frontend:
cd ../freelance-estimator-frontend
npm install

### 4. Preparar base de datos PostgreSQL

cd freelance-estimator-backend
npx prisma migrate deploy
npx prisma db seed

El seed carga 18 pesos del motor de cálculo. Sin esto las cotizaciones
devuelven valores incorrectos.

### 5. Levantar servicios

Terminal 1 — Backend:
cd freelance-estimator-backend
npm run start:dev

Terminal 2 — Frontend:
cd freelance-estimator-frontend
npm run dev

### 6. Ollama (módulo de IA)

ollama pull llama3.2
# Ollama corre automáticamente en localhost:11434

## URLs

| Servicio | URL |
|----------|-----|
| Frontend | http://localhost:5173 |
| API | http://localhost:3000/api |
| Swagger | http://localhost:3000/api/docs |

## Credenciales de prueba

Usuario admin de respaldo (funciona sin MongoDB):
- Email: admin@sistema.co
- Password: admin_respaldo_123

## Variables de entorno — Backend (.env)

DATABASE_URL=postgresql://postgres:TU_PASSWORD@localhost:5432/freelance_estimator
MONGODB_URI=mongodb://localhost:27017/freelance_estimator
JWT_SECRET=string_secreto_largo
JWT_EXPIRA=7d
PORT=3000
FRONTEND_URL=http://localhost:5173
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
ADMIN_EMAIL_RESPALDO=admin@sistema.co
ADMIN_PASSWORD_RESPALDO=admin_respaldo_123
TARIFA_HORA_DEFAULT=150000

## Variables de entorno — Frontend (.env)

VITE_API_URL=http://localhost:3000/api

## Estructura del proyecto

freeLance3.0/
├── freelance-estimator-backend/
│   ├── src/
│   │   ├── auth/          # JWT, registro, login, logout
│   │   ├── cotizaciones/  # Motor de cálculo ponderado
│   │   ├── ia/            # Integración Ollama (mockup + PDF)
│   │   ├── dashboard/     # Métricas del usuario
│   │   ├── divisas/       # Conversor COP/USD/EUR/GBP/JPY
│   │   ├── admin/         # Panel de pesos (solo ADMIN)
│   │   ├── prisma/        # Conexión PostgreSQL
│   │   └── mongo/         # Conexión MongoDB
│   └── prisma/
│       ├── schema.prisma  # Modelos de BD
│       └── seed.ts        # 18 pesos del motor de cálculo
└── freelance-estimator-frontend/
    └── src/
        ├── pages/         # Login, Register, Dashboard, Cotizador, Historial, Admin
        ├── components/    # UI reutilizable + layout + cotizador steps
        ├── api/           # Llamadas al backend con Axios
        ├── context/       # AuthContext con manejo de sesión
        ├── hooks/         # useAuth, useCotizacion, useIA
        └── types/         # Interfaces TypeScript

## Esquema de base de datos PostgreSQL

### Tabla: cotizaciones
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID (PK) | Identificador único generado automáticamente |
| usuario_id | String | UUID del usuario en MongoDB (referencia externa) |
| nombre_proyecto | String | Nombre descriptivo del proyecto cotizado |
| tipo_proyecto | String | landing, ecommerce, webapp, mobile, api, dashboard |
| cantidad_paginas | Int | Número de páginas o rutas estimadas (1-50) |
| nivel_disenio | String | basico, intermedio, premium, animado |
| hosting | String | ninguno, basico, vps, cloud |
| tiempo_entrega | String | 1semana, 2semanas, 1mes, mas1mes |
| cantidad_desarrolladores | Int | Número de desarrolladores involucrados (1-10) |
| horas_estimadas | Float | Resultado del cálculo de horas totales |
| costo_infraestructura | Float | Costo del hosting en COP |
| precio_final | Float | Precio total del proyecto en COP |
| complejidad | String | baja (< 80h), media (< 160h), alta (>= 160h) |
| generado_por_ia | Boolean | true si la IA pre-llenó el formulario |
| confianza_ia | Float? | Nivel de confianza de la IA (0-1), null si fue manual |
| creado_en | DateTime | Fecha y hora de creación (automático) |

### Tabla: cotizacion_tecnologias
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID (PK) | Identificador único |
| cotizacion_id | UUID (FK) | Referencia a cotizaciones.id |
| tecnologia | String | Nombre de la tecnología (React, Node.js, etc.) |

### Tabla: cotizacion_funcionalidades
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID (PK) | Identificador único |
| cotizacion_id | UUID (FK) | Referencia a cotizaciones.id |
| funcionalidad | String | Descripción de la funcionalidad detectada |
| fuente | String | manual o ia |

### Tabla: funcionalidades_adicionales
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID (PK) | Identificador único |
| nombre | String | Nombre de la funcionalidad adicional |
| descripcion | String? | Descripción opcional |
| horas_extra | Float | Horas adicionales que agrega al estimado |
| costo_extra | Float | Costo adicional en COP |

### Tabla: pesos_sistema
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID (PK) | Identificador único |
| clave | String (UNIQUE) | Identificador del peso (ej: landing_base_hours) |
| etiqueta | String | Nombre legible (ej: Landing Page - Horas base) |
| valor | Float | Valor numérico del peso (ej: 40, 1.3, 1500000) |
| categoria | String | Proyecto, Diseño, Tiempo, Infraestructura |

Valores iniciales del seed (18 registros):
Categoría Proyecto:
  landing_base_hours = 40
  ecommerce_base_hours = 200
  webapp_base_hours = 160
  mobile_base_hours = 240
  api_base_hours = 80
  dashboard_base_hours = 120
Categoría Diseño:
  design_basico = 1
  design_intermedio = 1.3
  design_premium = 1.6
  design_animado = 2
Categoría Tiempo:
  delivery_1semana = 1.5
  delivery_2semanas = 1.2
  delivery_1mes = 1
  delivery_mas1mes = 0.9
Categoría Infraestructura:
  hosting_ninguno = 0
  hosting_basico = 500000
  hosting_vps = 1500000
  hosting_cloud = 3000000

### Tabla: historial_cambios_pesos
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID (PK) | Identificador único |
| peso_id | UUID (FK) | Referencia a pesos_sistema.id |
| valor_anterior | Float | Valor antes del cambio |
| valor_nuevo | Float | Valor después del cambio |
| modificado_por | String | UUID del admin que hizo el cambio |
| modificado_en | DateTime | Fecha y hora del cambio (automático) |

### Tabla: tokens_refresco
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID (PK) | Identificador único |
| usuario_id | String | UUID del usuario en MongoDB |
| token | String (UNIQUE) | Token de refresco hasheado |
| expira_en | DateTime | Fecha de expiración del token |
| creado_en | DateTime | Fecha de creación (automático) |

### Tabla: tecnologias
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID (PK) | Identificador único |
| nombre | String (UNIQUE) | Nombre de la tecnología disponible |
| categoria | String | frontend, backend, database, cloud, mobile |
| activa | Boolean | Si aparece disponible en el cotizador |

## Esquema de base de datos MongoDB

### Colección: usuarios
| Campo | Tipo | Descripción |
|-------|------|-------------|
| _id | ObjectId | Identificador único de MongoDB |
| nombre | String (required) | Nombre del usuario |
| apellido | String (required) | Apellido del usuario |
| email | String (required, unique) | Correo en minúsculas, validado |
| password | String (required) | Hash bcrypt (nunca texto plano) |
| rol | String (enum) | USER o ADMIN, default: USER |
| activo | Boolean | Si la cuenta está habilitada, default: true |
| empresa | String? | Nombre de empresa opcional |
| telefono | String? | Teléfono de contacto opcional |
| tarifa_hora_cop | Number? | Tarifa por hora en COP para el cálculo |
| avatar_url | String? | URL del avatar del usuario |
| creado_en | Date | Fecha de creación, default: now |
| actualizado_en | Date | Fecha de última actualización, default: now |

## Fórmula del motor de cálculo

horasBase        = pesos_sistema WHERE clave = '{tipo}_base_hours'
multiplicadorD   = pesos_sistema WHERE clave = 'design_{nivel_disenio}'
multiplicadorT   = pesos_sistema WHERE clave = 'delivery_{tiempo_entrega}'
horasEstimadas   = horasBase × multiplicadorD × multiplicadorT
costoDesarrollo  = horasEstimadas × tarifa_hora_cop × cantidad_desarrolladores
infraestructura  = pesos_sistema WHERE clave = 'hosting_{hosting}'
precioFinal      = costoDesarrollo + infraestructura

Complejidad:
  horasEstimadas < 80   → baja
  horasEstimadas < 160  → media
  horasEstimadas >= 160 → alta

## Flujo de cotización con IA

1. Usuario selecciona "Analizar con IA" en el cotizador
2. Sube una imagen (mockup) o un PDF (historias de usuario)
3. El frontend envía el archivo al backend vía multipart/form-data
4. El backend extrae el contenido y construye el prompt para Llama
5. Llama devuelve JSON con los parámetros del proyecto
6. El backend valida el JSON y lo devuelve al frontend
7. El formulario se pre-llena automáticamente con los datos detectados
8. Se muestra el nivel de confianza y los supuestos que hizo la IA
9. El usuario revisa, ajusta si necesita, y confirma la cotización

## Pruebas

# Unitarias (Jest)
cd freelance-estimator-backend
npm run test

# Cobertura
npm run test:cov

## Docker (fase posterior)

docker compose up --build
