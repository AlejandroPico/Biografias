package com.example.biografias.service;

import com.example.biografias.model.Referencia;
import com.example.biografias.repository.ReferenciaRepository;
import com.example.biografias.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
// Optional is no longer needed for return types of getById and update
// import java.util.Optional;

@Service
public class ReferenciaService {

    private final ReferenciaRepository referenciaRepository;

    @Autowired
    public ReferenciaService(ReferenciaRepository referenciaRepository) {
        this.referenciaRepository = referenciaRepository;
    }

    public List<Referencia> getAllReferencias() {
        return referenciaRepository.findAll();
    }

    public Referencia getReferenciaById(Integer id) {
        return referenciaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Referencia not found with id: " + id));
    }

    public Referencia createReferencia(Referencia referencia) {
        // No createdAt or updatedAt fields in Referencia model
        return referenciaRepository.save(referencia);
    }

    public Referencia updateReferencia(Integer id, Referencia referenciaDetails) {
        Referencia existingReferencia = referenciaRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Referencia not found with id: " + id));

        existingReferencia.setPersona(referenciaDetails.getPersona());
        existingReferencia.setFuente(referenciaDetails.getFuente());
        existingReferencia.setTextoReferencia(referenciaDetails.getTextoReferencia());
        existingReferencia.setUrl(referenciaDetails.getUrl());
        return referenciaRepository.save(existingReferencia);
    }

    public void deleteReferencia(Integer id) {
        Referencia referencia = referenciaRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Referencia not found with id: " + id));
        referenciaRepository.delete(referencia);
    }
}
