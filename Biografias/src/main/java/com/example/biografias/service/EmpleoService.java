package com.example.biografias.service;

import com.example.biografias.model.Empleo;
import com.example.biografias.repository.EmpleoRepository;
import com.example.biografias.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
// Optional is no longer needed for return types of getById and update
// import java.util.Optional;

@Service
public class EmpleoService {

    private final EmpleoRepository empleoRepository;

    @Autowired
    public EmpleoService(EmpleoRepository empleoRepository) {
        this.empleoRepository = empleoRepository;
    }

    public List<Empleo> getAllEmpleos() {
        return empleoRepository.findAll();
    }

    public Empleo getEmpleoById(Integer id) {
        return empleoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Empleo not found with id: " + id));
    }

    public Empleo createEmpleo(Empleo empleo) {
        // No createdAt or updatedAt fields in Empleo model
        return empleoRepository.save(empleo);
    }

    public Empleo updateEmpleo(Integer id, Empleo empleoDetails) {
        Empleo existingEmpleo = empleoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Empleo not found with id: " + id));

        existingEmpleo.setPersona(empleoDetails.getPersona());
        existingEmpleo.setOrganizacion(empleoDetails.getOrganizacion());
        existingEmpleo.setCargo(empleoDetails.getCargo());
        existingEmpleo.setFechaInicio(empleoDetails.getFechaInicio());
        existingEmpleo.setFechaFin(empleoDetails.getFechaFin());
        existingEmpleo.setDescripcion(empleoDetails.getDescripcion());
        return empleoRepository.save(existingEmpleo);
    }

    public void deleteEmpleo(Integer id) {
        Empleo empleo = empleoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Empleo not found with id: " + id));
        empleoRepository.delete(empleo);
    }
}
