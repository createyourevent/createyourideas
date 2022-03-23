package net.createyourideas.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import net.createyourideas.app.domain.IdeaStarRating;
import net.createyourideas.app.repository.IdeaStarRatingRepository;
import net.createyourideas.app.service.IdeaStarRatingService;
import net.createyourideas.app.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link net.createyourideas.app.domain.IdeaStarRating}.
 */
@RestController
@RequestMapping("/api")
public class IdeaStarRatingResource {

    private final Logger log = LoggerFactory.getLogger(IdeaStarRatingResource.class);

    private static final String ENTITY_NAME = "ideaStarRating";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final IdeaStarRatingService ideaStarRatingService;

    private final IdeaStarRatingRepository ideaStarRatingRepository;

    public IdeaStarRatingResource(IdeaStarRatingService ideaStarRatingService, IdeaStarRatingRepository ideaStarRatingRepository) {
        this.ideaStarRatingService = ideaStarRatingService;
        this.ideaStarRatingRepository = ideaStarRatingRepository;
    }

    /**
     * {@code POST  /idea-star-ratings} : Create a new ideaStarRating.
     *
     * @param ideaStarRating the ideaStarRating to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new ideaStarRating, or with status {@code 400 (Bad Request)} if the ideaStarRating has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/idea-star-ratings")
    public ResponseEntity<IdeaStarRating> createIdeaStarRating(@RequestBody IdeaStarRating ideaStarRating) throws URISyntaxException {
        log.debug("REST request to save IdeaStarRating : {}", ideaStarRating);
        if (ideaStarRating.getId() != null) {
            throw new BadRequestAlertException("A new ideaStarRating cannot already have an ID", ENTITY_NAME, "idexists");
        }
        IdeaStarRating result = ideaStarRatingService.save(ideaStarRating);
        return ResponseEntity
            .created(new URI("/api/idea-star-ratings/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /idea-star-ratings/:id} : Updates an existing ideaStarRating.
     *
     * @param id the id of the ideaStarRating to save.
     * @param ideaStarRating the ideaStarRating to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ideaStarRating,
     * or with status {@code 400 (Bad Request)} if the ideaStarRating is not valid,
     * or with status {@code 500 (Internal Server Error)} if the ideaStarRating couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/idea-star-ratings/{id}")
    public ResponseEntity<IdeaStarRating> updateIdeaStarRating(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody IdeaStarRating ideaStarRating
    ) throws URISyntaxException {
        log.debug("REST request to update IdeaStarRating : {}, {}", id, ideaStarRating);
        if (ideaStarRating.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ideaStarRating.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!ideaStarRatingRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        IdeaStarRating result = ideaStarRatingService.save(ideaStarRating);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, ideaStarRating.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /idea-star-ratings/:id} : Partial updates given fields of an existing ideaStarRating, field will ignore if it is null
     *
     * @param id the id of the ideaStarRating to save.
     * @param ideaStarRating the ideaStarRating to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ideaStarRating,
     * or with status {@code 400 (Bad Request)} if the ideaStarRating is not valid,
     * or with status {@code 404 (Not Found)} if the ideaStarRating is not found,
     * or with status {@code 500 (Internal Server Error)} if the ideaStarRating couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/idea-star-ratings/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<IdeaStarRating> partialUpdateIdeaStarRating(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody IdeaStarRating ideaStarRating
    ) throws URISyntaxException {
        log.debug("REST request to partial update IdeaStarRating partially : {}, {}", id, ideaStarRating);
        if (ideaStarRating.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ideaStarRating.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!ideaStarRatingRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<IdeaStarRating> result = ideaStarRatingService.partialUpdate(ideaStarRating);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, ideaStarRating.getId().toString())
        );
    }

    /**
     * {@code GET  /idea-star-ratings} : get all the ideaStarRatings.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of ideaStarRatings in body.
     */
    @GetMapping("/idea-star-ratings")
    public List<IdeaStarRating> getAllIdeaStarRatings() {
        log.debug("REST request to get all IdeaStarRatings");
        return ideaStarRatingService.findAll();
    }

    /**
     * {@code GET  /idea-star-ratings/:id} : get the "id" ideaStarRating.
     *
     * @param id the id of the ideaStarRating to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the ideaStarRating, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/idea-star-ratings/{id}")
    public ResponseEntity<IdeaStarRating> getIdeaStarRating(@PathVariable Long id) {
        log.debug("REST request to get IdeaStarRating : {}", id);
        Optional<IdeaStarRating> ideaStarRating = ideaStarRatingService.findOne(id);
        return ResponseUtil.wrapOrNotFound(ideaStarRating);
    }

    /**
     * {@code DELETE  /idea-star-ratings/:id} : delete the "id" ideaStarRating.
     *
     * @param id the id of the ideaStarRating to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/idea-star-ratings/{id}")
    public ResponseEntity<Void> deleteIdeaStarRating(@PathVariable Long id) {
        log.debug("REST request to delete IdeaStarRating : {}", id);
        ideaStarRatingService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
