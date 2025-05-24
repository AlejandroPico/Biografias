package com.example.biografias.model;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

@Table(name = "persona")
public class Persona {

	@Id
	@Column(name = "PersonaID", nullable = false)
	private Integer personaID;

	@Column(name = "Nombre")
	private String nombre;

	@Column(name = "Apellidos")
	private String apellidos;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "FechaNacimiento")
	private Date fechaNacimiento;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "FechaFallecimiento")
	private Date fechaFallecimiento;

	@Column(name = "Genero")
	private String genero;

	@Column(name = "Nacionalidad")
	private String nacionalidad;

	@Column(name = "DescripcionCorta")
	private String descripcionCorta;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "CreatedAt")
	private Date createdAt;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "UpdatedAt")
	private Date updatedAt;

	public Persona() {

	}

	public Persona(Integer personaID) {
		this.personaID = personaID;
	}

	public Integer getPersonaID() {
		return personaID;
	}

	public void setPersonaID(Integer personaID) {
		this.personaID = personaID;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public String getApellidos() {
		return apellidos;
	}

	public void setApellidos(String apellidos) {
		this.apellidos = apellidos;
	}

	public Date getFechaNacimiento() {
		return fechaNacimiento;
	}

	public void setFechaNacimiento(Date fechaNacimiento) {
		this.fechaNacimiento = fechaNacimiento;
	}

	public Date getFechaFallecimiento() {
		return fechaFallecimiento;
	}

	public void setFechaFallecimiento(Date fechaFallecimiento) {
		this.fechaFallecimiento = fechaFallecimiento;
	}

	public String getGenero() {
		return genero;
	}

	public void setGenero(String genero) {
		this.genero = genero;
	}

	public String getNacionalidad() {
		return nacionalidad;
	}

	public void setNacionalidad(String nacionalidad) {
		this.nacionalidad = nacionalidad;
	}

	public String getDescripcionCorta() {
		return descripcionCorta;
	}

	public void setDescripcionCorta(String descripcionCorta) {
		this.descripcionCorta = descripcionCorta;
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
