package dev.mindsage.people.application;

import java.util.List;

public record PublicPersonDetail(
        PublicPersonSummary person,
        List<PublicLifeEvent> timeline,
        List<PublicWisdomEntry> wisdom
) {
}
