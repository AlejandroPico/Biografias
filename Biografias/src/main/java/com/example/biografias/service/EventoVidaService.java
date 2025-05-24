package com.example.biografias.service;

import com.example.biografias.model.EventoVida;
import com.example.biografias.repository.EventoVidaRepository;
import com.example.biografias.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
// Optional is no longer needed for return types of getById and update
// import java.util.Optional;

@Service
public class EventoVidaService {

    private final EventoVidaRepository eventoVidaRepository;

    @Autowired
    public EventoVidaService(EventoVidaRepository eventoVidaRepository) {
        this.eventoVidaRepository = eventoVidaRepository;
    }

    public List<EventoVida> getAllEventoVidas() {
        return eventoVidaRepository.findAll();
    }

    public EventoVida getEventoVidaById(Integer id) {
        return eventoVidaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("EventoVida not found with id: " + id));
    }

    public EventoVida createEventoVida(EventoVida eventoVida) {
        // No createdAt or updatedAt fields in EventoVida model
        return eventoVidaRepository.save(eventoVida);
    }

    public EventoVida updateEventoVida(Integer id, EventoVida eventoVidaDetails) {
        EventoVida existingEventoVida = eventoVidaRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("EventoVida not found with id: " + id));

        existingEventoVida.setPersona(eventoVidaDetails.getPersona());
        existingEventoVida.setTitulo(eventoVidaDetails.getTitulo());
        existingEventoVida.setDescripcion(eventoVidaDetails.getDescripcion());
        existingEventoVida.setFechaEvento(eventoVidaDetails.getFechaEvento());
        existingEventoVida.setOrden(eventoVidaDetails.getOrden());
        return eventoVidaRepository.save(existingEventoVida);
    }

    public void deleteEventoVida(Integer id) {
        EventoVida eventoVida = eventoVidaRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("EventoVida not found with id: " + id));
        eventoVidaRepository.delete(eventoVida);
    }
}
