package com.example.biografias.controller;

import com.example.biografias.model.Medio;
import com.example.biografias.service.MedioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medios")
public class MedioController {

    private final MedioService medioService;

    @Autowired
    public MedioController(MedioService medioService) {
        this.medioService = medioService;
    }

    @GetMapping
    public ResponseEntity<List<Medio>> getAllMedios() {
        List<Medio> medios = medioService.getAllMedios();
        return ResponseEntity.ok(medios);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Medio> getMedioById(@PathVariable Integer id) {
        Medio medio = medioService.getMedioById(id);
        return ResponseEntity.ok(medio);
    }

    @PostMapping
    public ResponseEntity<Medio> createMedio(@RequestBody Medio medio) {
        Medio createdMedio = medioService.createMedio(medio);
        return new ResponseEntity<>(createdMedio, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Medio> updateMedio(@PathVariable Integer id, @RequestBody Medio medioDetails) {
        Medio updatedMedio = medioService.updateMedio(id, medioDetails);
        return ResponseEntity.ok(updatedMedio);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedio(@PathVariable Integer id) {
        medioService.deleteMedio(id);
        return ResponseEntity.noContent().build();
    }
}
