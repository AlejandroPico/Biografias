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
@Table(name = "Medio")
public class Medio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MedioID")
    private Integer medioID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PersonaID", nullable = false)
    private Persona persona;

    @Column(name = "TipoMedio", nullable = false, length = 50)
    private String tipoMedio;

    @Column(name = "URL", nullable = false, length = 500)
    private String url;

    @Column(name = "Pie", length = 500)
    private String pie;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "FechaCarga", nullable = false)
    private Date fechaCarga;

    public Medio() {
    }

    public Medio(Persona persona, String tipoMedio, String url, Date fechaCarga) {
        this.persona = persona;
        this.tipoMedio = tipoMedio;
        this.url = url;
        this.fechaCarga = fechaCarga;
    }

    // Getters and Setters

    public Integer getMedioID() {
        return medioID;
    }

    public void setMedioID(Integer medioID) {
        this.medioID = medioID;
    }

    public Persona getPersona() {
        return persona;
    }

    public void setPersona(Persona persona) {
        this.persona = persona;
    }

    public String getTipoMedio() {
        return tipoMedio;
    }

    public void setTipoMedio(String tipoMedio) {
        this.tipoMedio = tipoMedio;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getPie() {
        return pie;
    }

    public void setPie(String pie) {
        this.pie = pie;
    }

    public Date getFechaCarga() {
        return fechaCarga;
    }

    public void setFechaCarga(Date fechaCarga) {
        this.fechaCarga = fechaCarga;
    }
}
