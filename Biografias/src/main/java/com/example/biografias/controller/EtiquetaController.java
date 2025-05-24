package com.example.biografias.controller;

import com.example.biografias.model.Etiqueta;
import com.example.biografias.service.EtiquetaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/etiquetas")
public class EtiquetaController {

    private final EtiquetaService etiquetaService;

    @Autowired
    public EtiquetaController(EtiquetaService etiquetaService) {
        this.etiquetaService = etiquetaService;
    }

    @GetMapping
    public ResponseEntity<List<Etiqueta>> getAllEtiquetas() {
        List<Etiqueta> etiquetas = etiquetaService.getAllEtiquetas();
        return ResponseEntity.ok(etiquetas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Etiqueta> getEtiquetaById(@PathVariable Integer id) {
        Etiqueta etiqueta = etiquetaService.getEtiquetaById(id);
        return ResponseEntity.ok(etiqueta);
    }

    @PostMapping
    public ResponseEntity<Etiqueta> createEtiqueta(@RequestBody Etiqueta etiqueta) {
        Etiqueta createdEtiqueta = etiquetaService.createEtiqueta(etiqueta);
        return new ResponseEntity<>(createdEtiqueta, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Etiqueta> updateEtiqueta(@PathVariable Integer id, @RequestBody Etiqueta etiquetaDetails) {
        Etiqueta updatedEtiqueta = etiquetaService.updateEtiqueta(id, etiquetaDetails);
        return ResponseEntity.ok(updatedEtiqueta);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEtiqueta(@PathVariable Integer id) {
        etiquetaService.deleteEtiqueta(id);
        return ResponseEntity.noContent().build();
    }
}
