package net.createyourideas.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import net.createyourideas.app.domain.Idea;
import net.createyourideas.app.repository.IdeaExtRepository;
import net.createyourideas.app.repository.IdeaRepository;
import net.createyourideas.app.service.IdeaExtService;
import net.createyourideas.app.service.IdeaService;
import net.createyourideas.app.web.rest.errors.BadRequestAlertException;

import org.hibernate.Hibernate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link net.createyourideas.app.domain.Idea}.
 */
@RestController
@RequestMapping("/api")
public class IdeaExtResource {

    private final Logger log = LoggerFactory.getLogger(IdeaExtResource.class);

    private static final String ENTITY_NAME = "idea";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final IdeaExtService ideaExtService;

    private final IdeaExtRepository ideaExtRepository;

    public IdeaExtResource(IdeaExtService ideaExtService, IdeaExtRepository ideaExtRepository) {
        this.ideaExtService = ideaExtService;
        this.ideaExtRepository = ideaExtRepository;
    }


    @GetMapping("/ideas/activeTrue/eagerAll")
    public List<Idea> getAllIdeasWhereActiveTrueEagerAll() {
        log.debug("REST request to get a page of Ideas where active = true");
        List<Idea> ideas = ideaExtService.findAllByActiveTrue();
        ideas.stream().forEach(i -> Hibernate.initialize(i.getIncomes()));
        ideas.stream().forEach(i -> Hibernate.initialize(i.getOutgoings()));
        ideas.stream().forEach(i -> Hibernate.initialize(i.getWorksheets()));
        ideas.stream().forEach(i -> Hibernate.initialize(i.getApplications()));
        ideas.stream().forEach(i -> Hibernate.initialize(i.getEmployees()));
        return ideas;
    }

    @GetMapping("/ideas/{id}/byId")
    public Idea getIdea(@PathVariable Long id) {
        log.debug("REST request to get Idea : {}", id);
        Idea idea = ideaExtService.findOneById(id);
        return idea;
    }

    @GetMapping("/ideas/activeTrue")
    public List<Idea> getAllIdeasWhereActiveTrue() {
        log.debug("REST request to get a page of Ideas where active = true");
        List<Idea> ideas = ideaExtService.findAllByActiveTrue();
        return ideas;
    }

    @GetMapping("/ideas/activeFalse")
    public List<Idea> getAllIdeasWhereActiveFalse() {
        log.debug("REST request to get a page of Ideas where active = false");
        List<Idea> ideas = ideaExtService.findAllByActiveFalse();
        return ideas;
    }

    @GetMapping("/ideas/activeUser")
    public List<Idea> getAllIdeasWhereUserLoggedIn() {
        log.debug("REST request to get a page of Ideas where user is logged in");
        List<Idea> ideas = ideaExtService.findByUserIsCurrentUser();
        return ideas;
    }

    @GetMapping("/ideas/activeTrue/eagerDonations/{id}")
    public Idea getIdeaWhereActiveTrueEagerDonations(@PathVariable Long id) {
        log.debug("REST request to get a page of Ideas where active = true");
        Idea idea = ideaExtService.findAllByActiveTrueEagerDonations(id);
        return idea;
    }

    @GetMapping("/ideas/activeTrue/eagerEmployees/{id}")
    public Idea getIdeaWhereActiveTrueEagerEmployees(@PathVariable Long id) {
        log.debug("REST request to get a page of Ideas where active = true and eager employees");
        Idea idea = ideaExtService.findAllByActiveTrueEagerEmployees(id);
        return idea;
    }

    @GetMapping("/ideas/activeTrue/eagerEmployeesApplications/{id}")
    public Idea getIdeaWhereActiveTrueEagerEmployeesAndApplications(@PathVariable Long id) {
        log.debug("REST request to get a page of Ideas where active = true and eager employees");
        Idea idea = ideaExtService.findAllByActiveTrueEagerEmployeesAndApplication(id);
        return idea;
    }

    @GetMapping("/ideas/activeTrue/eagerAll/{id}")
    public Idea getIdeaWhereActiveTrueEagerAll(@PathVariable Long id) {
        log.debug("REST request to get a page of Ideas where active = true and eager employees");
        Idea idea = ideaExtService.findOneByActiveTrueAndId(id);
        return idea;
    }

}
