package com.example.biografias.controller;

import com.example.biografias.model.EventoVida;
import com.example.biografias.service.EventoVidaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/eventosvida")
public class EventoVidaController {

    private final EventoVidaService eventoVidaService;

    @Autowired
    public EventoVidaController(EventoVidaService eventoVidaService) {
        this.eventoVidaService = eventoVidaService;
    }

    @GetMapping
    public ResponseEntity<List<EventoVida>> getAllEventoVidas() {
        List<EventoVida> eventoVidas = eventoVidaService.getAllEventoVidas();
        return ResponseEntity.ok(eventoVidas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventoVida> getEventoVidaById(@PathVariable Integer id) {
        EventoVida eventoVida = eventoVidaService.getEventoVidaById(id);
        return ResponseEntity.ok(eventoVida);
    }

    @PostMapping
    public ResponseEntity<EventoVida> createEventoVida(@RequestBody EventoVida eventoVida) {
        EventoVida createdEventoVida = eventoVidaService.createEventoVida(eventoVida);
        return new ResponseEntity<>(createdEventoVida, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventoVida> updateEventoVida(@PathVariable Integer id, @RequestBody EventoVida eventoVidaDetails) {
        EventoVida updatedEventoVida = eventoVidaService.updateEventoVida(id, eventoVidaDetails);
        return ResponseEntity.ok(updatedEventoVida);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEventoVida(@PathVariable Integer id) {
        eventoVidaService.deleteEventoVida(id);
        return ResponseEntity.noContent().build();
    }
}
