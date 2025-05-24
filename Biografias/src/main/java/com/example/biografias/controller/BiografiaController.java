package com.example.biografias.controller;

import com.example.biografias.model.Biografia;
import com.example.biografias.service.BiografiaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/biografias")
public class BiografiaController {

    private final BiografiaService biografiaService;

    @Autowired
    public BiografiaController(BiografiaService biografiaService) {
        this.biografiaService = biografiaService;
    }

    @GetMapping
    public ResponseEntity<List<Biografia>> getAllBiografias() {
        List<Biografia> biografias = biografiaService.getAllBiografias();
        return ResponseEntity.ok(biografias);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Biografia> getBiografiaById(@PathVariable Integer id) {
        Biografia biografia = biografiaService.getBiografiaById(id);
        return ResponseEntity.ok(biografia);
    }

    @PostMapping
    public ResponseEntity<Biografia> createBiografia(@RequestBody Biografia biografia) {
        Biografia createdBiografia = biografiaService.createBiografia(biografia);
        return new ResponseEntity<>(createdBiografia, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Biografia> updateBiografia(@PathVariable Integer id, @RequestBody Biografia biografiaDetails) {
        Biografia updatedBiografia = biografiaService.updateBiografia(id, biografiaDetails);
        return ResponseEntity.ok(updatedBiografia);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBiografia(@PathVariable Integer id) {
        biografiaService.deleteBiografia(id);
        return ResponseEntity.noContent().build();
    }
}
