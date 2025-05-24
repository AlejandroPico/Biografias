package com.example.biografias.repository;

import com.example.biografias.model.Referencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReferenciaRepository extends JpaRepository<Referencia, Integer> {
}
