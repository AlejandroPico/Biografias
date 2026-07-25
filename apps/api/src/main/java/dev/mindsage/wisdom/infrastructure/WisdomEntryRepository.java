package dev.mindsage.wisdom.infrastructure;

import dev.mindsage.people.domain.Visibility;
import dev.mindsage.wisdom.domain.WisdomEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WisdomEntryRepository extends JpaRepository<WisdomEntry, String> {

    List<WisdomEntry> findAllByPersonIdAndVisibilityOrderByRecordedOnDesc(
            String personId,
            Visibility visibility
    );
}
