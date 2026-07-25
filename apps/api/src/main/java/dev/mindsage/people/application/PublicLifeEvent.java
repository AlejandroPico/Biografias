package dev.mindsage.people.application;

import dev.mindsage.chronicle.domain.LifeEvent;

import java.time.LocalDate;

public record PublicLifeEvent(
        LocalDate startDate,
        LocalDate endDate,
        String datePrecision,
        String title,
        String description,
        String category,
        String location
) {
    static PublicLifeEvent from(LifeEvent event) {
        return new PublicLifeEvent(
                event.getStartDate(),
                event.getEndDate(),
                event.getDatePrecision(),
                event.getTitle(),
                event.getDescription(),
                event.getCategory(),
                event.getLocation()
        );
    }
}
