package com.example.biografias.model;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "Biografia", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"PersonaID", "CodigoIdioma", "Version"})
})
public class Biografia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BiografiaID")
    private Integer biografiaID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PersonaID", nullable = false)
    private Persona persona;

    @Column(name = "CodigoIdioma", nullable = false, length = 5)
    private String codigoIdioma;

    @Column(name = "Version", nullable = false)
    private Integer version;

    @Column(name = "TextoCompleto", nullable = false, columnDefinition = "NVARCHAR(MAX)")
    private String textoCompleto;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "CreatedAt", nullable = false)
    private Date createdAt;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "UpdatedAt", nullable = false)
    private Date updatedAt;

    public Biografia() {
    }

    public Biografia(Persona persona, String codigoIdioma, Integer version, String textoCompleto, Date createdAt, Date updatedAt) {
        this.persona = persona;
        this.codigoIdioma = codigoIdioma;
        this.version = version;
        this.textoCompleto = textoCompleto;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and Setters

    public Integer getBiografiaID() {
        return biografiaID;
    }

    public void setBiografiaID(Integer biografiaID) {
        this.biografiaID = biografiaID;
    }

    public Persona getPersona() {
        return persona;
    }

    public void setPersona(Persona persona) {
        this.persona = persona;
    }

    public String getCodigoIdioma() {
        return codigoIdioma;
    }

    public void setCodigoIdioma(String codigoIdioma) {
        this.codigoIdioma = codigoIdioma;
    }

    public Integer getVersion() {
        return version;
    }

    public void setVersion(Integer version) {
        this.version = version;
    }

    public String getTextoCompleto() {
        return textoCompleto;
    }

    public void setTextoCompleto(String textoCompleto) {
        this.textoCompleto = textoCompleto;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }
}
