package com.example.biografias.controller;

import com.example.biografias.model.Empleo;
import com.example.biografias.service.EmpleoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/empleos")
public class EmpleoController {

    private final EmpleoService empleoService;

    @Autowired
    public EmpleoController(EmpleoService empleoService) {
        this.empleoService = empleoService;
    }

    @GetMapping
    public ResponseEntity<List<Empleo>> getAllEmpleos() {
        List<Empleo> empleos = empleoService.getAllEmpleos();
        return ResponseEntity.ok(empleos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Empleo> getEmpleoById(@PathVariable Integer id) {
        Empleo empleo = empleoService.getEmpleoById(id);
        return ResponseEntity.ok(empleo);
    }

    @PostMapping
    public ResponseEntity<Empleo> createEmpleo(@RequestBody Empleo empleo) {
        Empleo createdEmpleo = empleoService.createEmpleo(empleo);
        return new ResponseEntity<>(createdEmpleo, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Empleo> updateEmpleo(@PathVariable Integer id, @RequestBody Empleo empleoDetails) {
        Empleo updatedEmpleo = empleoService.updateEmpleo(id, empleoDetails);
        return ResponseEntity.ok(updatedEmpleo);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmpleo(@PathVariable Integer id) {
        empleoService.deleteEmpleo(id);
        return ResponseEntity.noContent().build();
    }
}
