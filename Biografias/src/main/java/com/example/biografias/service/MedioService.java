package com.example.biografias.service;

import com.example.biografias.model.Medio;
import com.example.biografias.repository.MedioRepository;
import com.example.biografias.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
// Optional is no longer needed for return types of getById and update
// import java.util.Optional;

@Service
public class MedioService {

    private final MedioRepository medioRepository;

    @Autowired
    public MedioService(MedioRepository medioRepository) {
        this.medioRepository = medioRepository;
    }

    public List<Medio> getAllMedios() {
        return medioRepository.findAll();
    }

    public Medio getMedioById(Integer id) {
        return medioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medio not found with id: " + id));
    }

    public Medio createMedio(Medio medio) {
        medio.setFechaCarga(new Date()); // Set current date for new media
        return medioRepository.save(medio);
    }

    public Medio updateMedio(Integer id, Medio medioDetails) {
        Medio existingMedio = medioRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Medio not found with id: " + id));

        existingMedio.setPersona(medioDetails.getPersona());
        existingMedio.setTipoMedio(medioDetails.getTipoMedio());
        existingMedio.setUrl(medioDetails.getUrl());
        existingMedio.setPie(medioDetails.getPie());
        // FechaCarga is typically set at creation. If it needs to be updatable:
        // existingMedio.setFechaCarga(medioDetails.getFechaCarga() != null ? medioDetails.getFechaCarga() : existingMedio.getFechaCarga());
        return medioRepository.save(existingMedio);
    }

    public void deleteMedio(Integer id) {
        Medio medio = medioRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Medio not found with id: " + id));
        medioRepository.delete(medio);
    }
}
