package net.createyourideas.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import net.createyourideas.app.domain.UserPointAssociation;
import net.createyourideas.app.repository.UserPointAssociationRepository;
import net.createyourideas.app.service.UserPointAssociationService;
import net.createyourideas.app.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link net.createyourideas.app.domain.UserPointAssociation}.
 */
@RestController
@RequestMapping("/api")
public class UserPointAssociationResource {

    private final Logger log = LoggerFactory.getLogger(UserPointAssociationResource.class);

    private static final String ENTITY_NAME = "userPointAssociation";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UserPointAssociationService userPointAssociationService;

    private final UserPointAssociationRepository userPointAssociationRepository;

    public UserPointAssociationResource(
        UserPointAssociationService userPointAssociationService,
        UserPointAssociationRepository userPointAssociationRepository
    ) {
        this.userPointAssociationService = userPointAssociationService;
        this.userPointAssociationRepository = userPointAssociationRepository;
    }

    /**
     * {@code POST  /user-point-associations} : Create a new userPointAssociation.
     *
     * @param userPointAssociation the userPointAssociation to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new userPointAssociation, or with status {@code 400 (Bad Request)} if the userPointAssociation has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/user-point-associations")
    public ResponseEntity<UserPointAssociation> createUserPointAssociation(@RequestBody UserPointAssociation userPointAssociation)
        throws URISyntaxException {
        log.debug("REST request to save UserPointAssociation : {}", userPointAssociation);
        if (userPointAssociation.getId() != null) {
            throw new BadRequestAlertException("A new userPointAssociation cannot already have an ID", ENTITY_NAME, "idexists");
        }
        UserPointAssociation result = userPointAssociationService.save(userPointAssociation);
        return ResponseEntity
            .created(new URI("/api/user-point-associations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /user-point-associations/:id} : Updates an existing userPointAssociation.
     *
     * @param id the id of the userPointAssociation to save.
     * @param userPointAssociation the userPointAssociation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userPointAssociation,
     * or with status {@code 400 (Bad Request)} if the userPointAssociation is not valid,
     * or with status {@code 500 (Internal Server Error)} if the userPointAssociation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/user-point-associations/{id}")
    public ResponseEntity<UserPointAssociation> updateUserPointAssociation(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody UserPointAssociation userPointAssociation
    ) throws URISyntaxException {
        log.debug("REST request to update UserPointAssociation : {}, {}", id, userPointAssociation);
        if (userPointAssociation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userPointAssociation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userPointAssociationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        UserPointAssociation result = userPointAssociationService.save(userPointAssociation);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, userPointAssociation.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /user-point-associations/:id} : Partial updates given fields of an existing userPointAssociation, field will ignore if it is null
     *
     * @param id the id of the userPointAssociation to save.
     * @param userPointAssociation the userPointAssociation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userPointAssociation,
     * or with status {@code 400 (Bad Request)} if the userPointAssociation is not valid,
     * or with status {@code 404 (Not Found)} if the userPointAssociation is not found,
     * or with status {@code 500 (Internal Server Error)} if the userPointAssociation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/user-point-associations/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<UserPointAssociation> partialUpdateUserPointAssociation(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody UserPointAssociation userPointAssociation
    ) throws URISyntaxException {
        log.debug("REST request to partial update UserPointAssociation partially : {}, {}", id, userPointAssociation);
        if (userPointAssociation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userPointAssociation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userPointAssociationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<UserPointAssociation> result = userPointAssociationService.partialUpdate(userPointAssociation);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, userPointAssociation.getId().toString())
        );
    }

    /**
     * {@code GET  /user-point-associations} : get all the userPointAssociations.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of userPointAssociations in body.
     */
    @GetMapping("/user-point-associations")
    public List<UserPointAssociation> getAllUserPointAssociations() {
        log.debug("REST request to get all UserPointAssociations");
        return userPointAssociationService.findAll();
    }

    /**
     * {@code GET  /user-point-associations/:id} : get the "id" userPointAssociation.
     *
     * @param id the id of the userPointAssociation to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the userPointAssociation, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/user-point-associations/{id}")
    public ResponseEntity<UserPointAssociation> getUserPointAssociation(@PathVariable Long id) {
        log.debug("REST request to get UserPointAssociation : {}", id);
        Optional<UserPointAssociation> userPointAssociation = userPointAssociationService.findOne(id);
        return ResponseUtil.wrapOrNotFound(userPointAssociation);
    }

    /**
     * {@code DELETE  /user-point-associations/:id} : delete the "id" userPointAssociation.
     *
     * @param id the id of the userPointAssociation to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/user-point-associations/{id}")
    public ResponseEntity<Void> deleteUserPointAssociation(@PathVariable Long id) {
        log.debug("REST request to delete UserPointAssociation : {}", id);
        userPointAssociationService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
