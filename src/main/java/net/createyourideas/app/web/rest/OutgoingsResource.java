package net.createyourideas.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import net.createyourideas.app.domain.Outgoings;
import net.createyourideas.app.repository.OutgoingsRepository;
import net.createyourideas.app.service.OutgoingsService;
import net.createyourideas.app.web.rest.errors.BadRequestAlertException;
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
 * REST controller for managing {@link net.createyourideas.app.domain.Outgoings}.
 */
@RestController
@RequestMapping("/api")
public class OutgoingsResource {

    private final Logger log = LoggerFactory.getLogger(OutgoingsResource.class);

    private static final String ENTITY_NAME = "outgoings";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OutgoingsService outgoingsService;

    private final OutgoingsRepository outgoingsRepository;

    public OutgoingsResource(OutgoingsService outgoingsService, OutgoingsRepository outgoingsRepository) {
        this.outgoingsService = outgoingsService;
        this.outgoingsRepository = outgoingsRepository;
    }

    /**
     * {@code POST  /outgoings} : Create a new outgoings.
     *
     * @param outgoings the outgoings to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new outgoings, or with status {@code 400 (Bad Request)} if the outgoings has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/outgoings")
    public ResponseEntity<Outgoings> createOutgoings(@Valid @RequestBody Outgoings outgoings) throws URISyntaxException {
        log.debug("REST request to save Outgoings : {}", outgoings);
        if (outgoings.getId() != null) {
            throw new BadRequestAlertException("A new outgoings cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Outgoings result = outgoingsService.save(outgoings);
        return ResponseEntity
            .created(new URI("/api/outgoings/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /outgoings/:id} : Updates an existing outgoings.
     *
     * @param id the id of the outgoings to save.
     * @param outgoings the outgoings to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated outgoings,
     * or with status {@code 400 (Bad Request)} if the outgoings is not valid,
     * or with status {@code 500 (Internal Server Error)} if the outgoings couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/outgoings/{id}")
    public ResponseEntity<Outgoings> updateOutgoings(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Outgoings outgoings
    ) throws URISyntaxException {
        log.debug("REST request to update Outgoings : {}, {}", id, outgoings);
        if (outgoings.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, outgoings.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!outgoingsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Outgoings result = outgoingsService.save(outgoings);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, outgoings.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /outgoings/:id} : Partial updates given fields of an existing outgoings, field will ignore if it is null
     *
     * @param id the id of the outgoings to save.
     * @param outgoings the outgoings to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated outgoings,
     * or with status {@code 400 (Bad Request)} if the outgoings is not valid,
     * or with status {@code 404 (Not Found)} if the outgoings is not found,
     * or with status {@code 500 (Internal Server Error)} if the outgoings couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/outgoings/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Outgoings> partialUpdateOutgoings(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Outgoings outgoings
    ) throws URISyntaxException {
        log.debug("REST request to partial update Outgoings partially : {}, {}", id, outgoings);
        if (outgoings.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, outgoings.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!outgoingsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Outgoings> result = outgoingsService.partialUpdate(outgoings);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, outgoings.getId().toString())
        );
    }

    /**
     * {@code GET  /outgoings} : get all the outgoings.
     *
     * @param pageable the pagination information.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of outgoings in body.
     */
    @GetMapping("/outgoings")
    public ResponseEntity<List<Outgoings>> getAllOutgoings(
        Pageable pageable,
        @RequestParam(required = false, defaultValue = "false") boolean eagerload
    ) {
        log.debug("REST request to get a page of Outgoings");
        Page<Outgoings> page;
        if (eagerload) {
            page = outgoingsService.findAllWithEagerRelationships(pageable);
        } else {
            page = outgoingsService.findAll(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /outgoings/:id} : get the "id" outgoings.
     *
     * @param id the id of the outgoings to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the outgoings, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/outgoings/{id}")
    public ResponseEntity<Outgoings> getOutgoings(@PathVariable Long id) {
        log.debug("REST request to get Outgoings : {}", id);
        Optional<Outgoings> outgoings = outgoingsService.findOne(id);
        return ResponseUtil.wrapOrNotFound(outgoings);
    }

    /**
     * {@code DELETE  /outgoings/:id} : delete the "id" outgoings.
     *
     * @param id the id of the outgoings to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/outgoings/{id}")
    public ResponseEntity<Void> deleteOutgoings(@PathVariable Long id) {
        log.debug("REST request to delete Outgoings : {}", id);
        outgoingsService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
