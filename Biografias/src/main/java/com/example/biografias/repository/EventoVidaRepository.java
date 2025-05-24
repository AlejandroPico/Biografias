package com.example.biografias.repository;

import com.example.biografias.model.EventoVida;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventoVidaRepository extends JpaRepository<EventoVida, Integer> {
}
