package com.example.biografias.service;

import com.example.biografias.model.Etiqueta;
import com.example.biografias.repository.EtiquetaRepository;
import com.example.biografias.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
// Optional is no longer needed for return types of getById and update
// import java.util.Optional;

@Service
public class EtiquetaService {

    private final EtiquetaRepository etiquetaRepository;

    @Autowired
    public EtiquetaService(EtiquetaRepository etiquetaRepository) {
        this.etiquetaRepository = etiquetaRepository;
    }

    public List<Etiqueta> getAllEtiquetas() {
        return etiquetaRepository.findAll();
    }

    public Etiqueta getEtiquetaById(Integer id) {
        return etiquetaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Etiqueta not found with id: " + id));
    }

    public Etiqueta createEtiqueta(Etiqueta etiqueta) {
        // No createdAt or updatedAt fields in Etiqueta model
        return etiquetaRepository.save(etiqueta);
    }

    public Etiqueta updateEtiqueta(Integer id, Etiqueta etiquetaDetails) {
        Etiqueta existingEtiqueta = etiquetaRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Etiqueta not found with id: " + id));

        existingEtiqueta.setNombre(etiquetaDetails.getNombre());
        // The 'personas' Set is managed via the Persona entity's lifecycle callbacks or service methods if needed
        return etiquetaRepository.save(existingEtiqueta);
    }

    public void deleteEtiqueta(Integer id) {
        Etiqueta etiqueta = etiquetaRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Etiqueta not found with id: " + id));
        etiquetaRepository.delete(etiqueta);
    }
}
