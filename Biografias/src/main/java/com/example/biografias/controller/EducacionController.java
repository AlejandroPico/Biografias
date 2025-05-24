package com.example.biografias.controller;

import com.example.biografias.model.Educacion;
import com.example.biografias.service.EducacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/educaciones")
public class EducacionController {

    private final EducacionService educacionService;

    @Autowired
    public EducacionController(EducacionService educacionService) {
        this.educacionService = educacionService;
    }

    @GetMapping
    public ResponseEntity<List<Educacion>> getAllEducaciones() {
        List<Educacion> educaciones = educacionService.getAllEducaciones();
        return ResponseEntity.ok(educaciones);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Educacion> getEducacionById(@PathVariable Integer id) {
        Educacion educacion = educacionService.getEducacionById(id);
        return ResponseEntity.ok(educacion);
    }

    @PostMapping
    public ResponseEntity<Educacion> createEducacion(@RequestBody Educacion educacion) {
        Educacion createdEducacion = educacionService.createEducacion(educacion);
        return new ResponseEntity<>(createdEducacion, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Educacion> updateEducacion(@PathVariable Integer id, @RequestBody Educacion educacionDetails) {
        Educacion updatedEducacion = educacionService.updateEducacion(id, educacionDetails);
        return ResponseEntity.ok(updatedEducacion);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEducacion(@PathVariable Integer id) {
        educacionService.deleteEducacion(id);
        return ResponseEntity.noContent().build();
    }
}
