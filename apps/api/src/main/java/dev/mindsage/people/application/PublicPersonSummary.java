package dev.mindsage.people.application;

import dev.mindsage.people.domain.PersonProfile;

import java.time.LocalDate;

public record PublicPersonSummary(
        String slug,
        String displayName,
        LocalDate birthDate,
        LocalDate deathDate,
        String summary,
        String birthplace,
        String primaryOccupation,
        String nationality,
        int biographyCompleteness
) {
    static PublicPersonSummary from(PersonProfile person) {
        var displayName = person.getPreferredName() == null || person.getPreferredName().isBlank()
                ? person.getGivenNames() + " " + person.getFamilyNames()
                : person.getPreferredName() + " " + person.getFamilyNames();

        return new PublicPersonSummary(
                person.getSlug(),
                displayName,
                person.getBirthDate(),
                person.getDeathDate(),
                person.getSummary(),
                person.getBirthplace(),
                person.getPrimaryOccupation(),
                person.getNationality(),
                person.getBiographyCompleteness()
        );
    }
}
