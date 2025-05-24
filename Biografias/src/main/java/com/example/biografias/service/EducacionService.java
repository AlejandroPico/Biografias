package com.example.biografias.service;

import com.example.biografias.model.Educacion;
import com.example.biografias.repository.EducacionRepository;
import com.example.biografias.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
// Optional is no longer needed for return types of getById and update
// import java.util.Optional;

@Service
public class EducacionService {

    private final EducacionRepository educacionRepository;

    @Autowired
    public EducacionService(EducacionRepository educacionRepository) {
        this.educacionRepository = educacionRepository;
    }

    public List<Educacion> getAllEducaciones() {
        return educacionRepository.findAll();
    }

    public Educacion getEducacionById(Integer id) {
        return educacionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Educacion not found with id: " + id));
    }

    public Educacion createEducacion(Educacion educacion) {
        // No createdAt or updatedAt fields in Educacion model
        return educacionRepository.save(educacion);
    }

    public Educacion updateEducacion(Integer id, Educacion educacionDetails) {
        Educacion existingEducacion = educacionRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Educacion not found with id: " + id));

        existingEducacion.setPersona(educacionDetails.getPersona());
        existingEducacion.setInstitucion(educacionDetails.getInstitucion());
        existingEducacion.setTituloObtenido(educacionDetails.getTituloObtenido());
        existingEducacion.setCampoEstudio(educacionDetails.getCampoEstudio());
        existingEducacion.setFechaInicio(educacionDetails.getFechaInicio());
        existingEducacion.setFechaFin(educacionDetails.getFechaFin());
        existingEducacion.setDescripcion(educacionDetails.getDescripcion());
        return educacionRepository.save(existingEducacion);
    }

    public void deleteEducacion(Integer id) {
        Educacion educacion = educacionRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Educacion not found with id: " + id));
        educacionRepository.delete(educacion);
    }
}
