package com.example.biografias.model;

import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "Etiqueta", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"Nombre"})
})
public class Etiqueta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "EtiquetaID")
    private Integer etiquetaID;

    @Column(name = "Nombre", nullable = false, unique = true, length = 100)
    private String nombre;

    @ManyToMany(mappedBy = "etiquetas")
    private Set<Persona> personas;

    public Etiqueta() {
    }

    public Etiqueta(String nombre) {
        this.nombre = nombre;
    }

    // Getters and Setters

    public Integer getEtiquetaID() {
        return etiquetaID;
    }

    public void setEtiquetaID(Integer etiquetaID) {
        this.etiquetaID = etiquetaID;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Set<Persona> getPersonas() {
        return personas;
    }

    public void setPersonas(Set<Persona> personas) {
        this.personas = personas;
    }
}
