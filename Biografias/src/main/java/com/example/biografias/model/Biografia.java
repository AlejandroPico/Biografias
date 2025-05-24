package com.example.biografias.model;

/*
 * -- 3. Tabla Biografías (texto completo, por idioma y versión)
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

 */

public class Biografia {
}
