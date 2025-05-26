# Biografias
Proyecto de experimentación de nuevas IAs de vibe coding

## Database Schema

The backend uses a SQL database with the following schema:

```sql
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

USE BiografiasDB;
GO

-- 1. Personas
INSERT INTO dbo.Persona (Nombre, Apellidos, FechaNacimiento, FechaFallecimiento, Genero, Nacionalidad, DescripcionCorta) VALUES
('Pablo',        'Picasso',               '1881-10-25', '1973-04-08', 'Masculino', 'Española',  'Pintor y escultor español, cofundador del cubismo'),
('Marie',        'Curie',                 '1867-11-07', '1934-07-04', 'Femenino',  'Polaca',    'Química y física pionera en el estudio de la radiactividad'),
('Gabriel',      'García Márquez',        '1927-03-06', '2014-04-17', 'Masculino', 'Colombiana', 'Escritor y periodista, premio Nobel de Literatura 1982'),
('Frida',        'Kahlo',                 '1907-07-06', '1954-07-13', 'Femenino',  'Mexicana',  'Pintora surrealista y símbolo del feminismo'),
('Albert',       'Einstein',              '1879-03-14', '1955-04-18', 'Masculino', 'Suiza',     'Físico teórico, padre de la teoría de la relatividad');

-- 2. Biografías
INSERT INTO dbo.Biografia (PersonaID, CodigoIdioma, TextoCompleto) VALUES
(1, 'es-ES', 'Pablo Ruiz Picasso nació en Málaga y desarrolló una carrera prolífica que abarcó más de siete décadas. Fue cofundador del cubismo junto a Georges Braque.'),
(2, 'es-ES', 'Marie Skłodowska Curie fue la primera persona en ganar dos premios Nobel en distintas disciplinas: Física (1903) y Química (1911).'),
(3, 'es-ES', 'Gabriel García Márquez, apodado Gabo, nació en Aracataca. Su obra maestra "Cien años de soledad" marcó un hito en la literatura latinoamericana.'),
(4, 'es-ES', 'Frida Kahlo plasmó en sus autorretratos su dolor físico y emocional, fusionando el folclore mexicano con el surrealismo.'),
(5, 'es-ES', 'Albert Einstein formuló la teoría de la relatividad especial en 1905 y la general en 1915, cambiando nuestra comprensión del espacio y el tiempo.');

-- 3. Eventos de vida
INSERT INTO dbo.EventoVida (PersonaID, Titulo, Descripcion, FechaEvento, Orden) VALUES
(1, 'Nacimiento',           'Nacimiento de Pablo Picasso en Málaga, España',                            '1881-10-25', 1),
(2, 'Primer Nobel',         'Marie Curie recibe el Nobel de Física junto a Pierre Curie y Becquerel',   '1903-12-10', 1),
(3, 'Publicación clave',    'Publicación de "Cien años de soledad"',                                    '1967-05-30', 1),
(4, 'Accidente de tranvía', 'Se accidenta en Coyoacán, marcando su estilo pictórico posterior',         '1925-09-17', 1),
(5, 'Teoría especial',      'Presenta su artículo sobre la relatividad especial en Annalen der Physik', '1905-06-30', 1);

-- 4. Formación académica
INSERT INTO dbo.Educacion (PersonaID, Institucion, TituloObtenido, CampoEstudio, FechaInicio, FechaFin, Descripcion) VALUES
(1, 'Escuela de Bellas Artes de La Coruña',  NULL,                'Dibujo',         '1895-09-01', '1897-06-30', 'Formación básica en dibujo y pintura'),
(2, 'Universidad de París',                  'Doctorado',         'Física y Química','1891-10-01','1894-07-01','Investigación en radiactividad'),
(3, 'Universidad Nacional de Colombia',      'Licenciatura',      'Derecho',        '1947-03-01', '1950-11-30','Estudios de derecho y periodismo'),
(4, 'Escuela Nacional Preparatoria',         NULL,                'Artes Plásticas', '1922-01-01','1925-12-15','Clases de dibujo y pintura'),
(5, 'ETH Zúrich',                            'Diploma',           'Física',         '1896-10-01','1900-07-30','Estudios en ingeniería y física');

-- 5. Empleos / Trayectoria profesional
INSERT INTO dbo.Empleo (PersonaID, Organizacion, Cargo, FechaInicio, FechaFin, Descripcion) VALUES
(1, 'Taller propio (París)',   'Artista independiente', '1904-01-01','1973-04-08','Producción de obras en diversos estilos'),
(2, 'Universidad de la Sorbona','Profesora de Física',   '1906-05-01','1934-07-04','Docencia e investigación en radiactividad'),
(3, 'El Universal',             'Reportero',             '1950-01-01','1955-12-31','Crónicas y artículos periodísticos en Latinoamérica'),
(4, 'Taller Casa Azul',         'Pintora profesional',   '1927-01-01','1954-07-13','Exhibiciones individuales y colectivas'),
(5, 'Universidad de Princeton', 'Profesor visitante',    '1933-10-01','1955-04-18','Clases sobre relatividad y fraternales conferencias');

-- 6. Publicaciones
INSERT INTO dbo.Publicacion (PersonaID, Titulo, FechaPublicacion, Tipo, URL) VALUES
(1, 'Catálogo razonado de Picasso', '1956-05-01', 'Libro', 'https://ejemplo.org/picasso-catalogo'),
(2, 'Recherches sur les substances radioactives', '1903-06-15', 'Artículo', 'https://ejemplo.org/curie-1903'),
(3, 'Cien años de soledad',          '1967-05-30', 'Libro', 'https://ejemplo.org/cien-anos'),
(4, 'Exposición de Frida Kahlo',     '1938-11-10', 'Catálogo', 'https://ejemplo.org/kahlo-expo'),
(5, 'Zur Elektrodynamik bewegter Körper', '1905-06-30', 'Artículo', 'https://ejemplo.org/einstein-rel');

-- 7. Medios (imágenes, vídeos…)
INSERT INTO dbo.Medio (PersonaID, TipoMedio, URL, Pie) VALUES
(1, 'imagen', 'https://ejemplo.org/img/picasso.jpg', 'Retrato de Pablo Picasso, 1957'),
(2, 'imagen', 'https://ejemplo.org/img/curie.jpg',   'Marie Curie en su laboratorio'),
(3, 'video',  'https://ejemplo.org/vid/garcia.mp4',  'Conferencia de García Márquez sobre realismo mágico'),
(4, 'imagen', 'https://ejemplo.org/img/kahlo.jpg',   'Autorretrato de Frida Kahlo, 1940'),
(5, 'imagen', 'https://ejemplo.org/img/einstein.jpg','Albert Einstein en 1921');

-- 8. Etiquetas
INSERT INTO dbo.Etiqueta (Nombre) VALUES
('Pintor'),
('Científico'),
('Escritor'),
('Artista'),
('Físico');

-- 9. PersonaEtiqueta (relación N:N)
INSERT INTO dbo.PersonaEtiqueta (PersonaID, EtiquetaID) VALUES
(1, 1),  -- Picasso: Pintor
(2, 2),  -- Curie: Científico
(3, 3),  -- García Márquez: Escritor
(4, 4),  -- Kahlo: Artista
(5, 5);  -- Einstein: Físico

-- 10. Referencias bibliográficas u orígenes
INSERT INTO dbo.Referencia (PersonaID, Fuente, TextoReferencia, URL) VALUES
(1, 'Biografía oficial de Picasso',   'Fundación Picasso. Museo Casa Natal.',              'https://picasso.org/es/'),
(2, 'Nobel Prize',                     'Nobel Prize Lecture, 1903.',                         'https://nobelprize.org/prizes/physics/1903/curie/lecture/'),
(3, 'Editorial Sudamericana',          'Edición original de "Cien años de soledad".',        'https://sudamericana.com/libro/cien-anos'),
(4, 'Banco de México',                 'Exposición permanente en Bellas Artes.',             'https://banxico.org.mx/kahlo/'),
(5, 'Annalen der Physik',              'Artículo original de 1905 sobre relatividad especial','https://annalen.de/1905/einstein.pdf');

```
