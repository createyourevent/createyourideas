package net.createyourideas.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.StreamSupport;
import net.createyourideas.app.domain.IdeaTransactionId;
import net.createyourideas.app.repository.IdeaTransactionIdRepository;
import net.createyourideas.app.service.IdeaTransactionIdService;
import net.createyourideas.app.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link net.createyourideas.app.domain.IdeaTransactionId}.
 */
@RestController
@RequestMapping("/api")
public class IdeaTransactionIdResource {

    private final Logger log = LoggerFactory.getLogger(IdeaTransactionIdResource.class);

    private static final String ENTITY_NAME = "ideaTransactionId";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final IdeaTransactionIdService ideaTransactionIdService;

    private final IdeaTransactionIdRepository ideaTransactionIdRepository;

    public IdeaTransactionIdResource(
        IdeaTransactionIdService ideaTransactionIdService,
        IdeaTransactionIdRepository ideaTransactionIdRepository
    ) {
        this.ideaTransactionIdService = ideaTransactionIdService;
        this.ideaTransactionIdRepository = ideaTransactionIdRepository;
    }

    /**
     * {@code POST  /idea-transaction-ids} : Create a new ideaTransactionId.
     *
     * @param ideaTransactionId the ideaTransactionId to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new ideaTransactionId, or with status {@code 400 (Bad Request)} if the ideaTransactionId has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/idea-transaction-ids")
    public ResponseEntity<IdeaTransactionId> createIdeaTransactionId(@RequestBody IdeaTransactionId ideaTransactionId)
        throws URISyntaxException {
        log.debug("REST request to save IdeaTransactionId : {}", ideaTransactionId);
        if (ideaTransactionId.getId() != null) {
            throw new BadRequestAlertException("A new ideaTransactionId cannot already have an ID", ENTITY_NAME, "idexists");
        }
        IdeaTransactionId result = ideaTransactionIdService.save(ideaTransactionId);
        return ResponseEntity
            .created(new URI("/api/idea-transaction-ids/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /idea-transaction-ids/:id} : Updates an existing ideaTransactionId.
     *
     * @param id the id of the ideaTransactionId to save.
     * @param ideaTransactionId the ideaTransactionId to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ideaTransactionId,
     * or with status {@code 400 (Bad Request)} if the ideaTransactionId is not valid,
     * or with status {@code 500 (Internal Server Error)} if the ideaTransactionId couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/idea-transaction-ids/{id}")
    public ResponseEntity<IdeaTransactionId> updateIdeaTransactionId(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody IdeaTransactionId ideaTransactionId
    ) throws URISyntaxException {
        log.debug("REST request to update IdeaTransactionId : {}, {}", id, ideaTransactionId);
        if (ideaTransactionId.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ideaTransactionId.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!ideaTransactionIdRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        IdeaTransactionId result = ideaTransactionIdService.save(ideaTransactionId);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, ideaTransactionId.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /idea-transaction-ids/:id} : Partial updates given fields of an existing ideaTransactionId, field will ignore if it is null
     *
     * @param id the id of the ideaTransactionId to save.
     * @param ideaTransactionId the ideaTransactionId to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ideaTransactionId,
     * or with status {@code 400 (Bad Request)} if the ideaTransactionId is not valid,
     * or with status {@code 404 (Not Found)} if the ideaTransactionId is not found,
     * or with status {@code 500 (Internal Server Error)} if the ideaTransactionId couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/idea-transaction-ids/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<IdeaTransactionId> partialUpdateIdeaTransactionId(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody IdeaTransactionId ideaTransactionId
    ) throws URISyntaxException {
        log.debug("REST request to partial update IdeaTransactionId partially : {}, {}", id, ideaTransactionId);
        if (ideaTransactionId.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ideaTransactionId.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!ideaTransactionIdRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<IdeaTransactionId> result = ideaTransactionIdService.partialUpdate(ideaTransactionId);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, ideaTransactionId.getId().toString())
        );
    }

    /**
     * {@code GET  /idea-transaction-ids} : get all the ideaTransactionIds.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of ideaTransactionIds in body.
     */
    @GetMapping("/idea-transaction-ids")
    public List<IdeaTransactionId> getAllIdeaTransactionIds(@RequestParam(required = false) String filter) {
        if ("idea-is-null".equals(filter)) {
            log.debug("REST request to get all IdeaTransactionIds where idea is null");
            return ideaTransactionIdService.findAllWhereIdeaIsNull();
        }
        log.debug("REST request to get all IdeaTransactionIds");
        return ideaTransactionIdService.findAll();
    }

    /**
     * {@code GET  /idea-transaction-ids/:id} : get the "id" ideaTransactionId.
     *
     * @param id the id of the ideaTransactionId to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the ideaTransactionId, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/idea-transaction-ids/{id}")
    public ResponseEntity<IdeaTransactionId> getIdeaTransactionId(@PathVariable Long id) {
        log.debug("REST request to get IdeaTransactionId : {}", id);
        Optional<IdeaTransactionId> ideaTransactionId = ideaTransactionIdService.findOne(id);
        return ResponseUtil.wrapOrNotFound(ideaTransactionId);
    }

    /**
     * {@code DELETE  /idea-transaction-ids/:id} : delete the "id" ideaTransactionId.
     *
     * @param id the id of the ideaTransactionId to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/idea-transaction-ids/{id}")
    public ResponseEntity<Void> deleteIdeaTransactionId(@PathVariable Long id) {
        log.debug("REST request to delete IdeaTransactionId : {}", id);
        ideaTransactionIdService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
