package dev.mindsage.people.infrastructure;

import dev.mindsage.people.domain.PersonProfile;
import dev.mindsage.people.domain.Visibility;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PersonRepository extends JpaRepository<PersonProfile, String> {

    List<PersonProfile> findAllByVisibilityOrderByFamilyNamesAscGivenNamesAsc(Visibility visibility);

    Optional<PersonProfile> findBySlugAndVisibility(String slug, Visibility visibility);
}
