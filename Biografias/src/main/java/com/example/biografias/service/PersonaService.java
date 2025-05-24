package com.example.biografias.service;

import com.example.biografias.model.Persona;
import com.example.biografias.repository.PersonaRepository;
import com.example.biografias.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
// Optional is no longer needed for return types of getById and update
// import java.util.Optional; 

@Service
public class PersonaService {

    private final PersonaRepository personaRepository;

    @Autowired
    public PersonaService(PersonaRepository personaRepository) {
        this.personaRepository = personaRepository;
    }

    public List<Persona> getAllPersonas() {
        return personaRepository.findAll();
    }

    public Persona getPersonaById(Integer id) {
        return personaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Persona not found with id: " + id));
    }

    public Persona createPersona(Persona persona) {
        persona.setCreatedAt(new Date());
        persona.setUpdatedAt(new Date());
        return personaRepository.save(persona);
    }

    public Persona updatePersona(Integer id, Persona personaDetails) {
        Persona existingPersona = personaRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Persona not found with id: " + id));

        existingPersona.setNombre(personaDetails.getNombre());
        existingPersona.setApellidos(personaDetails.getApellidos());
        existingPersona.setFechaNacimiento(personaDetails.getFechaNacimiento());
        existingPersona.setFechaFallecimiento(personaDetails.getFechaFallecimiento());
        existingPersona.setGenero(personaDetails.getGenero());
        existingPersona.setNacionalidad(personaDetails.getNacionalidad());
        existingPersona.setDescripcionCorta(personaDetails.getDescripcionCorta());
        existingPersona.setUpdatedAt(new Date()); // Update the timestamp
        // Note: Managing collections like biografias, etiquetas, etc., is not handled here.
        return personaRepository.save(existingPersona);
    }

    public void deletePersona(Integer id) {
        Persona persona = personaRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Persona not found with id: " + id));
        personaRepository.delete(persona);
    }
}
