package com.example.biografias.service;

import com.example.biografias.model.Biografia;
import com.example.biografias.repository.BiografiaRepository;
import com.example.biografias.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
// Optional is no longer needed for return types of getById and update
// import java.util.Optional; 

@Service
public class BiografiaService {

    private final BiografiaRepository biografiaRepository;

    @Autowired
    public BiografiaService(BiografiaRepository biografiaRepository) {
        this.biografiaRepository = biografiaRepository;
    }

    public List<Biografia> getAllBiografias() {
        return biografiaRepository.findAll();
    }

    public Biografia getBiografiaById(Integer id) {
        return biografiaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Biografia not found with id: " + id));
    }

    public Biografia createBiografia(Biografia biografia) {
        biografia.setCreatedAt(new Date());
        biografia.setUpdatedAt(new Date());
        return biografiaRepository.save(biografia);
    }

    public Biografia updateBiografia(Integer id, Biografia biografiaDetails) {
        Biografia existingBiografia = biografiaRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Biografia not found with id: " + id));

        existingBiografia.setPersona(biografiaDetails.getPersona());
        existingBiografia.setCodigoIdioma(biografiaDetails.getCodigoIdioma());
        existingBiografia.setVersion(biografiaDetails.getVersion());
        existingBiografia.setTextoCompleto(biografiaDetails.getTextoCompleto());
        existingBiografia.setUpdatedAt(new Date());
        return biografiaRepository.save(existingBiografia);
    }

    public void deleteBiografia(Integer id) {
        Biografia biografia = biografiaRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Biografia not found with id: " + id));
        biografiaRepository.delete(biografia);
    }
}
