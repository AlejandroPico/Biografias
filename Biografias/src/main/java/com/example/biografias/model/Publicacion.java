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

@Entity
@Table(name = "Publicacion")
public class Publicacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PublicacionID")
    private Integer publicacionID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PersonaID", nullable = false)
    private Persona persona;

    @Column(name = "Titulo", nullable = false, length = 300)
    private String titulo;

    @Temporal(TemporalType.DATE)
    @Column(name = "FechaPublicacion")
    private Date fechaPublicacion;

    @Column(name = "Tipo", length = 100)
    private String tipo; // libro, artículo, conferencia…

    @Column(name = "URL", length = 500)
    private String url;

    public Publicacion() {
    }

    public Publicacion(Persona persona, String titulo) {
        this.persona = persona;
        this.titulo = titulo;
    }

    // Getters and Setters

    public Integer getPublicacionID() {
        return publicacionID;
    }

    public void setPublicacionID(Integer publicacionID) {
        this.publicacionID = publicacionID;
    }

    public Persona getPersona() {
        return persona;
    }

    public void setPersona(Persona persona) {
        this.persona = persona;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public Date getFechaPublicacion() {
        return fechaPublicacion;
    }

    public void setFechaPublicacion(Date fechaPublicacion) {
        this.fechaPublicacion = fechaPublicacion;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
