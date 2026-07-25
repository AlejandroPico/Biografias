package dev.mindsage.people.application;

import dev.mindsage.wisdom.domain.WisdomEntry;

import java.time.LocalDate;

public record PublicWisdomEntry(
        String title,
        String message,
        String audience,
        String theme,
        LocalDate recordedOn,
        String sourceType
) {
    static PublicWisdomEntry from(WisdomEntry entry) {
        return new PublicWisdomEntry(
                entry.getTitle(),
                entry.getMessage(),
                entry.getAudience(),
                entry.getTheme(),
                entry.getRecordedOn(),
                entry.getSourceType()
        );
    }
}
