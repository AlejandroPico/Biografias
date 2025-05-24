-- 1. Crear la base de datos
CREATE DATABASE BiografiasDB;
GO

USE BiografiasDB;
GO

-- 2. Tabla Personas
CREATE TABLE dbo.Persona (
    PersonaID       INT             IDENTITY(1,1) PRIMARY KEY,
    Nombre          NVARCHAR(100)   NOT NULL,
    Apellidos       NVARCHAR(100)   NOT NULL,
    FechaNacimiento DATE            NULL,
    FechaFallecimiento DATE         NULL,
    Genero          NVARCHAR(50)    NULL,
    Nacionalidad    NVARCHAR(100)   NULL,
    DescripcionCorta NVARCHAR(500)  NULL,
    CreatedAt       DATETIME2       NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt       DATETIME2       NOT NULL DEFAULT SYSUTCDATETIME()
);

-- 3. Tabla Biografías (texto completo, por idioma y versión)
CREATE TABLE dbo.Biografia (
    BiografiaID     INT             IDENTITY(1,1) PRIMARY KEY,
    PersonaID       INT             NOT NULL 
                        CONSTRAINT FK_Biografia_Persona FOREIGN KEY REFERENCES dbo.Persona(PersonaID),
    CodigoIdioma    CHAR(5)         NOT NULL,  -- e.g. 'es-ES', 'en-US'
    Version         INT             NOT NULL DEFAULT 1,
    TextoCompleto   NVARCHAR(MAX)   NOT NULL,
    CreatedAt       DATETIME2       NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt       DATETIME2       NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT UQ_Biografia_Persona_Idioma_Version UNIQUE(PersonaID, CodigoIdioma, Version)
);

-- 4. Eventos de vida
CREATE TABLE dbo.EventoVida (
    EventoID        INT             IDENTITY(1,1) PRIMARY KEY,
    PersonaID       INT             NOT NULL 
                        CONSTRAINT FK_EventoVida_Persona FOREIGN KEY REFERENCES dbo.Persona(PersonaID),
    Titulo          NVARCHAR(200)   NOT NULL,
    Descripcion     NVARCHAR(MAX)   NULL,
    FechaEvento     DATE            NULL,
    Orden           INT             NOT NULL DEFAULT 0
);

-- 5. Formación académica
CREATE TABLE dbo.Educacion (
    EducacionID     INT             IDENTITY(1,1) PRIMARY KEY,
    PersonaID       INT             NOT NULL 
                        CONSTRAINT FK_Educacion_Persona FOREIGN KEY REFERENCES dbo.Persona(PersonaID),
    Institucion     NVARCHAR(200)   NOT NULL,
    TituloObtenido  NVARCHAR(200)   NULL,
    CampoEstudio    NVARCHAR(200)   NULL,
    FechaInicio     DATE            NULL,
    FechaFin        DATE            NULL,
    Descripcion     NVARCHAR(MAX)   NULL
);

-- 6. Empleos / Trayectoria profesional
CREATE TABLE dbo.Empleo (
    EmpleoID        INT             IDENTITY(1,1) PRIMARY KEY,
    PersonaID       INT             NOT NULL 
                        CONSTRAINT FK_Empleo_Persona FOREIGN KEY REFERENCES dbo.Persona(PersonaID),
    Organizacion    NVARCHAR(200)   NOT NULL,
    Cargo           NVARCHAR(200)   NULL,
    FechaInicio     DATE            NULL,
    FechaFin        DATE            NULL,
    Descripcion     NVARCHAR(MAX)   NULL
);

-- 7. Publicaciones
CREATE TABLE dbo.Publicacion (
    PublicacionID   INT             IDENTITY(1,1) PRIMARY KEY,
    PersonaID       INT             NOT NULL 
                        CONSTRAINT FK_Publicacion_Persona FOREIGN KEY REFERENCES dbo.Persona(PersonaID),
    Titulo          NVARCHAR(300)   NOT NULL,
    FechaPublicacion DATE           NULL,
    Tipo            NVARCHAR(100)   NULL,  -- libro, artículo, conferencia…
    URL             NVARCHAR(500)   NULL
);

-- 8. Medios (imágenes, vídeos…)
CREATE TABLE dbo.Medio (
    MedioID         INT             IDENTITY(1,1) PRIMARY KEY,
    PersonaID       INT             NOT NULL 
                        CONSTRAINT FK_Medio_Persona FOREIGN KEY REFERENCES dbo.Persona(PersonaID),
    TipoMedio       NVARCHAR(50)    NOT NULL,  -- 'imagen', 'video'
    URL             NVARCHAR(500)   NOT NULL,
    Pie             NVARCHAR(500)   NULL,
    FechaCarga      DATETIME2       NOT NULL DEFAULT SYSUTCDATETIME()
);

-- 9. Etiquetas y relación N:N entre Persona y Etiqueta
CREATE TABLE dbo.Etiqueta (
    EtiquetaID      INT             IDENTITY(1,1) PRIMARY KEY,
    Nombre          NVARCHAR(100)   NOT NULL UNIQUE
);

CREATE TABLE dbo.PersonaEtiqueta (
    PersonaID       INT             NOT NULL 
                        CONSTRAINT FK_PE_Persona FOREIGN KEY REFERENCES dbo.Persona(PersonaID),
    EtiquetaID      INT             NOT NULL 
                        CONSTRAINT FK_PE_Etiqueta FOREIGN KEY REFERENCES dbo.Etiqueta(EtiquetaID),
    CONSTRAINT PK_PersonaEtiqueta PRIMARY KEY(PersonaID, EtiquetaID)
);

-- 10. Referencias bibliográficas u orígenes
CREATE TABLE dbo.Referencia (
    ReferenciaID    INT             IDENTITY(1,1) PRIMARY KEY,
    PersonaID       INT             NOT NULL 
                        CONSTRAINT FK_Referencia_Persona FOREIGN KEY REFERENCES dbo.Persona(PersonaID),
    Fuente          NVARCHAR(200)   NULL,    -- nombre del libro, web, etc.
    TextoReferencia NVARCHAR(MAX)   NULL,
    URL             NVARCHAR(500)   NULL
);
