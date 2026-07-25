package dev.mindsage.people.application;

import dev.mindsage.chronicle.infrastructure.LifeEventRepository;
import dev.mindsage.people.domain.Visibility;
import dev.mindsage.people.infrastructure.PersonRepository;
import dev.mindsage.shared.web.ResourceNotFoundException;
import dev.mindsage.wisdom.infrastructure.WisdomEntryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class PeopleQueryService {

    private final PersonRepository people;
    private final LifeEventRepository lifeEvents;
    private final WisdomEntryRepository wisdomEntries;

    public PeopleQueryService(
            PersonRepository people,
            LifeEventRepository lifeEvents,
            WisdomEntryRepository wisdomEntries
    ) {
        this.people = people;
        this.lifeEvents = lifeEvents;
        this.wisdomEntries = wisdomEntries;
    }

    public List<PublicPersonSummary> findPublicPeople() {
        return people.findAllByVisibilityOrderByFamilyNamesAscGivenNamesAsc(Visibility.PUBLIC)
                .stream()
                .map(PublicPersonSummary::from)
                .toList();
    }

    public PublicPersonDetail findPublicPerson(String slug) {
        var person = people.findBySlugAndVisibility(slug, Visibility.PUBLIC)
                .orElseThrow(() -> new ResourceNotFoundException("No existe una memoria pública con ese identificador."));

        var timeline = lifeEvents
                .findAllByPersonIdAndVisibilityOrderByOrderIndexAsc(person.getId(), Visibility.PUBLIC)
                .stream()
                .map(PublicLifeEvent::from)
                .toList();

        var wisdom = wisdomEntries
                .findAllByPersonIdAndVisibilityOrderByRecordedOnDesc(person.getId(), Visibility.PUBLIC)
                .stream()
                .map(PublicWisdomEntry::from)
                .toList();

        return new PublicPersonDetail(PublicPersonSummary.from(person), timeline, wisdom);
    }
}
