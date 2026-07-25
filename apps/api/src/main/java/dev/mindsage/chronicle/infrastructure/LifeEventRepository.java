package dev.mindsage.chronicle.infrastructure;

import dev.mindsage.chronicle.domain.LifeEvent;
import dev.mindsage.people.domain.Visibility;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LifeEventRepository extends JpaRepository<LifeEvent, String> {

    List<LifeEvent> findAllByPersonIdAndVisibilityOrderByOrderIndexAsc(
            String personId,
            Visibility visibility
    );
}
