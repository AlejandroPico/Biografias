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
@Table(name = "Empleo")
public class Empleo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "EmpleoID")
    private Integer empleoID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PersonaID", nullable = false)
    private Persona persona;

    @Column(name = "Organizacion", nullable = false, length = 200)
    private String organizacion;

    @Column(name = "Cargo", length = 200)
    private String cargo;

    @Temporal(TemporalType.DATE)
    @Column(name = "FechaInicio")
    private Date fechaInicio;

    @Temporal(TemporalType.DATE)
    @Column(name = "FechaFin")
    private Date fechaFin;

    @Column(name = "Descripcion", columnDefinition = "NVARCHAR(MAX)")
    private String descripcion;

    public Empleo() {
    }

    public Empleo(Persona persona, String organizacion) {
        this.persona = persona;
        this.organizacion = organizacion;
    }

    // Getters and Setters

    public Integer getEmpleoID() {
        return empleoID;
    }

    public void setEmpleoID(Integer empleoID) {
        this.empleoID = empleoID;
    }

    public Persona getPersona() {
        return persona;
    }

    public void setPersona(Persona persona) {
        this.persona = persona;
    }

    public String getOrganizacion() {
        return organizacion;
    }

    public void setOrganizacion(String organizacion) {
        this.organizacion = organizacion;
    }

    public String getCargo() {
        return cargo;
    }

    public void setCargo(String cargo) {
        this.cargo = cargo;
    }

    public Date getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(Date fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public Date getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(Date fechaFin) {
        this.fechaFin = fechaFin;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
}
