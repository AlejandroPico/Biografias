package dev.mindsage.people.domain;

import dev.mindsage.shared.persistence.AuditedEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;

import java.time.LocalDate;

@Entity
@Table(name = "people")
public class PersonProfile extends AuditedEntity {

    @Column(nullable = false, unique = true, length = 120)
    private String slug;

    @Column(name = "given_names", nullable = false, length = 180)
    private String givenNames;

    @Column(name = "family_names", nullable = false, length = 180)
    private String familyNames;

    @Column(name = "preferred_name", length = 120)
    private String preferredName;

    @Column(length = 80)
    private String pronouns;

    @Column(name = "gender_identity", length = 120)
    private String genderIdentity;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    @Column(name = "death_date")
    private LocalDate deathDate;

    @Column(nullable = false, length = 1000)
    private String summary;

    @Column(length = 240)
    private String birthplace;

    @Column(name = "current_residence", length = 240)
    private String currentResidence;

    @Column(name = "primary_occupation", length = 240)
    private String primaryOccupation;

    @Column(length = 240)
    private String nationality;

    @Column(length = 240)
    private String languages;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 24)
    private Visibility visibility;

    @Column(name = "consent_status", nullable = false, length = 32)
    private String consentStatus;

    @Column(name = "biography_completeness", nullable = false)
    private int biographyCompleteness;

    protected PersonProfile() {
    }

    public String getSlug() {
        return slug;
    }

    public String getGivenNames() {
        return givenNames;
    }

    public String getFamilyNames() {
        return familyNames;
    }

    public String getPreferredName() {
        return preferredName;
    }

    public String getPronouns() {
        return pronouns;
    }

    public String getGenderIdentity() {
        return genderIdentity;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public LocalDate getDeathDate() {
        return deathDate;
    }

    public String getSummary() {
        return summary;
    }

    public String getBirthplace() {
        return birthplace;
    }

    public String getCurrentResidence() {
        return currentResidence;
    }

    public String getPrimaryOccupation() {
        return primaryOccupation;
    }

    public String getNationality() {
        return nationality;
    }

    public String getLanguages() {
        return languages;
    }

    public Visibility getVisibility() {
        return visibility;
    }

    public String getConsentStatus() {
        return consentStatus;
    }

    public int getBiographyCompleteness() {
        return biographyCompleteness;
    }
}
