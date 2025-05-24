package com.example.biografias.controller;

import com.example.biografias.model.Referencia;
import com.example.biografias.service.ReferenciaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/referencias")
public class ReferenciaController {

    private final ReferenciaService referenciaService;

    @Autowired
    public ReferenciaController(ReferenciaService referenciaService) {
        this.referenciaService = referenciaService;
    }

    @GetMapping
    public ResponseEntity<List<Referencia>> getAllReferencias() {
        List<Referencia> referencias = referenciaService.getAllReferencias();
        return ResponseEntity.ok(referencias);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Referencia> getReferenciaById(@PathVariable Integer id) {
        Referencia referencia = referenciaService.getReferenciaById(id);
        return ResponseEntity.ok(referencia);
    }

    @PostMapping
    public ResponseEntity<Referencia> createReferencia(@RequestBody Referencia referencia) {
        Referencia createdReferencia = referenciaService.createReferencia(referencia);
        return new ResponseEntity<>(createdReferencia, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Referencia> updateReferencia(@PathVariable Integer id, @RequestBody Referencia referenciaDetails) {
        Referencia updatedReferencia = referenciaService.updateReferencia(id, referenciaDetails);
        return ResponseEntity.ok(updatedReferencia);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReferencia(@PathVariable Integer id) {
        referenciaService.deleteReferencia(id);
        return ResponseEntity.noContent().build();
    }
}
