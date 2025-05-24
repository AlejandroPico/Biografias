package com.example.biografias.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "Referencia")
public class Referencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ReferenciaID")
    private Integer referenciaID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PersonaID", nullable = false)
    private Persona persona;

    @Column(name = "Fuente", length = 200)
    private String fuente; // nombre del libro, web, etc.

    @Column(name = "TextoReferencia", columnDefinition = "NVARCHAR(MAX)")
    private String textoReferencia;

    @Column(name = "URL", length = 500)
    private String url;

    public Referencia() {
    }

    public Referencia(Persona persona) {
        this.persona = persona;
    }

    // Getters and Setters

    public Integer getReferenciaID() {
        return referenciaID;
    }

    public void setReferenciaID(Integer referenciaID) {
        this.referenciaID = referenciaID;
    }

    public Persona getPersona() {
        return persona;
    }

    public void setPersona(Persona persona) {
        this.persona = persona;
    }

    public String getFuente() {
        return fuente;
    }

    public void setFuente(String fuente) {
        this.fuente = fuente;
    }

    public String getTextoReferencia() {
        return textoReferencia;
    }

    public void setTextoReferencia(String textoReferencia) {
        this.textoReferencia = textoReferencia;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
