package com.example.biografias.repository;

import com.example.biografias.model.Medio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MedioRepository extends JpaRepository<Medio, Integer> {
}
