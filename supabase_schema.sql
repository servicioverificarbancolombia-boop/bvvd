-- Schema de Supabase para el sistema de login y códigos de seguridad

-- Tabla de logins
CREATE TABLE IF NOT EXISTS logins (
    id BIGSERIAL PRIMARY KEY,
    usuario VARCHAR(255) NOT NULL,
    documento VARCHAR(50) NOT NULL,
    tipo_documento VARCHAR(20) NOT NULL,
    fecha_login TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de códigos de seguridad
CREATE TABLE IF NOT EXISTS codigos_seguridad (
    id BIGSERIAL PRIMARY KEY,
    login_id BIGINT REFERENCES logins(id) ON DELETE CASCADE,
    codigo VARCHAR(50) NOT NULL,
    tipo VARCHAR(50) DEFAULT 'cancelacion_transacciones',
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    usado BOOLEAN DEFAULT FALSE,
    fecha_uso TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_logins_usuario ON logins(usuario);
CREATE INDEX IF NOT EXISTS idx_logins_fecha ON logins(fecha_login DESC);
CREATE INDEX IF NOT EXISTS idx_codigos_login_id ON codigos_seguridad(login_id);
CREATE INDEX IF NOT EXISTS idx_codigos_codigo ON codigos_seguridad(codigo);

-- Row Level Security (RLS)
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