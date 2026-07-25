package dev.mindsage.people.web;

import dev.mindsage.people.application.PeopleQueryService;
import dev.mindsage.people.application.PublicPersonDetail;
import dev.mindsage.people.application.PublicPersonSummary;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;
import java.util.List;

@RestController
@RequestMapping("/api/v1/public/people")
public class PublicPeopleController {

    private final PeopleQueryService people;

    public PublicPeopleController(PeopleQueryService people) {
        this.people = people;
    }

    @GetMapping
    public ResponseEntity<List<PublicPersonSummary>> findAll() {
        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(Duration.ofMinutes(5)).cachePublic())
                .body(people.findPublicPeople());
    }

    @GetMapping("/{slug}")
    public ResponseEntity<PublicPersonDetail> findOne(@PathVariable String slug) {
        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(Duration.ofMinutes(5)).cachePublic())
                .body(people.findPublicPerson(slug));
    }
}
