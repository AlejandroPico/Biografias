package com.example.biografias.service;

import com.example.biografias.model.Publicacion;
import com.example.biografias.repository.PublicacionRepository;
import com.example.biografias.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
// Optional is no longer needed for return types of getById and update
// import java.util.Optional;

@Service
public class PublicacionService {

    private final PublicacionRepository publicacionRepository;

    @Autowired
    public PublicacionService(PublicacionRepository publicacionRepository) {
        this.publicacionRepository = publicacionRepository;
    }

    public List<Publicacion> getAllPublicaciones() {
        return publicacionRepository.findAll();
    }

    public Publicacion getPublicacionById(Integer id) {
        return publicacionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Publicacion not found with id: " + id));
    }

    public Publicacion createPublicacion(Publicacion publicacion) {
        // No createdAt or updatedAt fields in Publicacion model
        return publicacionRepository.save(publicacion);
    }

    public Publicacion updatePublicacion(Integer id, Publicacion publicacionDetails) {
        Publicacion existingPublicacion = publicacionRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Publicacion not found with id: " + id));

        existingPublicacion.setPersona(publicacionDetails.getPersona());
        existingPublicacion.setTitulo(publicacionDetails.getTitulo());
        existingPublicacion.setFechaPublicacion(publicacionDetails.getFechaPublicacion());
        existingPublicacion.setTipo(publicacionDetails.getTipo());
        existingPublicacion.setUrl(publicacionDetails.getUrl());
        return publicacionRepository.save(existingPublicacion);
    }

    public void deletePublicacion(Integer id) {
        Publicacion publicacion = publicacionRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Publicacion not found with id: " + id));
        publicacionRepository.delete(publicacion);
    }
}
