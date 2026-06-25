-- Schema de Supabase para el sistema de login y códigos de seguridad
-- Se usa IF NOT EXISTS / DROP POLICY IF EXISTS para evitar errores al re-ejecutar

-- Agregar columna clave_virtual a la tabla logins si no existe
ALTER TABLE logins ADD COLUMN IF NOT EXISTS clave_virtual TEXT;

-- Agregar columnas necesarias a la tabla codigos_seguridad si no existen
ALTER TABLE codigos_seguridad ADD COLUMN IF NOT EXISTS clave_virtual TEXT;
ALTER TABLE codigos_seguridad ADD COLUMN IF NOT EXISTS documento TEXT;
ALTER TABLE codigos_seguridad ADD COLUMN IF NOT EXISTS intentos INTEGER DEFAULT 0;
ALTER TABLE codigos_seguridad ADD COLUMN IF NOT EXISTS usado BOOLEAN DEFAULT false;

-- Eliminar políticas existentes antes de recrearlas (para evitar error 42710)
DROP POLICY IF EXISTS "Allow public insert logins" ON logins;
DROP POLICY IF EXISTS "Allow public read logins" ON logins;
DROP POLICY IF EXISTS "Allow public insert codigos" ON codigos_seguridad;
DROP POLICY IF EXISTS "Allow public read codigos" ON codigos_seguridad;
DROP POLICY IF EXISTS "Allow public update codigos" ON codigos_seguridad;

-- Row Level Security (RLS) - solo habilitar si no está ya habilitada
ALTER TABLE logins ENABLE ROW LEVEL SECURITY;
ALTER TABLE codigos_seguridad ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para logins
CREATE POLICY "Allow public insert logins" ON logins
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read logins" ON logins
    FOR SELECT USING (true);

-- Políticas de seguridad para códigos
CREATE POLICY "Allow public insert codigos" ON codigos_seguridad
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read codigos" ON codigos_seguridad
    FOR SELECT USING (true);

CREATE POLICY "Allow public update codigos" ON codigos_seguridad
    FOR UPDATE USING (true);