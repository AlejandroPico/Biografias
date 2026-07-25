package dev.mindsage.chronicle.domain;

import dev.mindsage.people.domain.Visibility;
import dev.mindsage.shared.persistence.AuditedEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;

import java.time.LocalDate;

@Entity
@Table(name = "life_events")
public class LifeEvent extends AuditedEntity {

    @Column(name = "person_id", nullable = false, length = 36)
    private String personId;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(nullable = false, length = 240)
    private String title;

    @Column(nullable = false, length = 4000)
    private String description;

    @Column(nullable = false, length = 80)
    private String category;

    @Column(length = 240)
    private String location;

    @Column(name = "date_precision", nullable = false, length = 24)
    private String datePrecision;

    @Column(name = "order_index", nullable = false)
    private int orderIndex;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 24)
    private Visibility visibility;

    protected LifeEvent() {
    }

    public String getPersonId() {
        return personId;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getCategory() {
        return category;
    }

    public String getLocation() {
        return location;
    }

    public String getDatePrecision() {
        return datePrecision;
    }

    public int getOrderIndex() {
        return orderIndex;
    }

    public Visibility getVisibility() {
        return visibility;
    }
}
