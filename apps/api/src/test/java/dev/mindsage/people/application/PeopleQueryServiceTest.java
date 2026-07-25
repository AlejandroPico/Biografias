package dev.mindsage.people.application;

import dev.mindsage.chronicle.infrastructure.LifeEventRepository;
import dev.mindsage.people.domain.Visibility;
import dev.mindsage.people.infrastructure.PersonRepository;
import dev.mindsage.shared.web.ResourceNotFoundException;
import dev.mindsage.wisdom.infrastructure.WisdomEntryRepository;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class PeopleQueryServiceTest {

    @Test
    void rejectsUnknownOrNonPublicProfiles() {
        var people = mock(PersonRepository.class);
        var events = mock(LifeEventRepository.class);
        var wisdom = mock(WisdomEntryRepository.class);
        when(people.findBySlugAndVisibility("privado", Visibility.PUBLIC)).thenReturn(Optional.empty());

        var service = new PeopleQueryService(people, events, wisdom);

        assertThatThrownBy(() -> service.findPublicPerson("privado"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("memoria pública");
    }
}
