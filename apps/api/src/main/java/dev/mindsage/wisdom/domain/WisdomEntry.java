package dev.mindsage.wisdom.domain;

import dev.mindsage.people.domain.Visibility;
import dev.mindsage.shared.persistence.AuditedEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;

import java.time.LocalDate;

@Entity
@Table(name = "wisdom_entries")
public class WisdomEntry extends AuditedEntity {

    @Column(name = "person_id", nullable = false, length = 36)
    private String personId;

    @Column(nullable = false, length = 240)
    private String title;

    @Column(nullable = false, length = 6000)
    private String message;

    @Column(length = 240)
    private String audience;

    @Column(nullable = false, length = 120)
    private String theme;

    @Column(name = "recorded_on")
    private LocalDate recordedOn;

    @Column(name = "source_type", nullable = false, length = 40)
    private String sourceType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 24)
    private Visibility visibility;

    protected WisdomEntry() {
    }

    public String getPersonId() {
        return personId;
    }

    public String getTitle() {
        return title;
    }

    public String getMessage() {
        return message;
    }

    public String getAudience() {
        return audience;
    }

    public String getTheme() {
        return theme;
    }

    public LocalDate getRecordedOn() {
        return recordedOn;
    }

    public String getSourceType() {
        return sourceType;
    }

    public Visibility getVisibility() {
        return visibility;
    }
}
