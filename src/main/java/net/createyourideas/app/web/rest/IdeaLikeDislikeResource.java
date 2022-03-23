package net.createyourideas.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import net.createyourideas.app.domain.IdeaLikeDislike;
import net.createyourideas.app.repository.IdeaLikeDislikeRepository;
import net.createyourideas.app.service.IdeaLikeDislikeService;
import net.createyourideas.app.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link net.createyourideas.app.domain.IdeaLikeDislike}.
 */
@RestController
@RequestMapping("/api")
public class IdeaLikeDislikeResource {

    private final Logger log = LoggerFactory.getLogger(IdeaLikeDislikeResource.class);

    private static final String ENTITY_NAME = "ideaLikeDislike";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final IdeaLikeDislikeService ideaLikeDislikeService;

    private final IdeaLikeDislikeRepository ideaLikeDislikeRepository;

    public IdeaLikeDislikeResource(IdeaLikeDislikeService ideaLikeDislikeService, IdeaLikeDislikeRepository ideaLikeDislikeRepository) {
        this.ideaLikeDislikeService = ideaLikeDislikeService;
        this.ideaLikeDislikeRepository = ideaLikeDislikeRepository;
    }

    /**
     * {@code POST  /idea-like-dislikes} : Create a new ideaLikeDislike.
     *
     * @param ideaLikeDislike the ideaLikeDislike to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new ideaLikeDislike, or with status {@code 400 (Bad Request)} if the ideaLikeDislike has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/idea-like-dislikes")
    public ResponseEntity<IdeaLikeDislike> createIdeaLikeDislike(@RequestBody IdeaLikeDislike ideaLikeDislike) throws URISyntaxException {
        log.debug("REST request to save IdeaLikeDislike : {}", ideaLikeDislike);
        if (ideaLikeDislike.getId() != null) {
            throw new BadRequestAlertException("A new ideaLikeDislike cannot already have an ID", ENTITY_NAME, "idexists");
        }
        IdeaLikeDislike result = ideaLikeDislikeService.save(ideaLikeDislike);
        return ResponseEntity
            .created(new URI("/api/idea-like-dislikes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /idea-like-dislikes/:id} : Updates an existing ideaLikeDislike.
     *
     * @param id the id of the ideaLikeDislike to save.
     * @param ideaLikeDislike the ideaLikeDislike to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ideaLikeDislike,
     * or with status {@code 400 (Bad Request)} if the ideaLikeDislike is not valid,
     * or with status {@code 500 (Internal Server Error)} if the ideaLikeDislike couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/idea-like-dislikes/{id}")
    public ResponseEntity<IdeaLikeDislike> updateIdeaLikeDislike(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody IdeaLikeDislike ideaLikeDislike
    ) throws URISyntaxException {
        log.debug("REST request to update IdeaLikeDislike : {}, {}", id, ideaLikeDislike);
        if (ideaLikeDislike.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ideaLikeDislike.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!ideaLikeDislikeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        IdeaLikeDislike result = ideaLikeDislikeService.save(ideaLikeDislike);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, ideaLikeDislike.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /idea-like-dislikes/:id} : Partial updates given fields of an existing ideaLikeDislike, field will ignore if it is null
     *
     * @param id the id of the ideaLikeDislike to save.
     * @param ideaLikeDislike the ideaLikeDislike to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ideaLikeDislike,
     * or with status {@code 400 (Bad Request)} if the ideaLikeDislike is not valid,
     * or with status {@code 404 (Not Found)} if the ideaLikeDislike is not found,
     * or with status {@code 500 (Internal Server Error)} if the ideaLikeDislike couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/idea-like-dislikes/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<IdeaLikeDislike> partialUpdateIdeaLikeDislike(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody IdeaLikeDislike ideaLikeDislike
    ) throws URISyntaxException {
        log.debug("REST request to partial update IdeaLikeDislike partially : {}, {}", id, ideaLikeDislike);
        if (ideaLikeDislike.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ideaLikeDislike.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!ideaLikeDislikeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<IdeaLikeDislike> result = ideaLikeDislikeService.partialUpdate(ideaLikeDislike);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, ideaLikeDislike.getId().toString())
        );
    }

    /**
     * {@code GET  /idea-like-dislikes} : get all the ideaLikeDislikes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of ideaLikeDislikes in body.
     */
    @GetMapping("/idea-like-dislikes")
    public List<IdeaLikeDislike> getAllIdeaLikeDislikes() {
        log.debug("REST request to get all IdeaLikeDislikes");
        return ideaLikeDislikeService.findAll();
    }

    /**
     * {@code GET  /idea-like-dislikes/:id} : get the "id" ideaLikeDislike.
     *
     * @param id the id of the ideaLikeDislike to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the ideaLikeDislike, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/idea-like-dislikes/{id}")
    public ResponseEntity<IdeaLikeDislike> getIdeaLikeDislike(@PathVariable Long id) {
        log.debug("REST request to get IdeaLikeDislike : {}", id);
        Optional<IdeaLikeDislike> ideaLikeDislike = ideaLikeDislikeService.findOne(id);
        return ResponseUtil.wrapOrNotFound(ideaLikeDislike);
    }

    /**
     * {@code DELETE  /idea-like-dislikes/:id} : delete the "id" ideaLikeDislike.
     *
     * @param id the id of the ideaLikeDislike to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/idea-like-dislikes/{id}")
    public ResponseEntity<Void> deleteIdeaLikeDislike(@PathVariable Long id) {
        log.debug("REST request to delete IdeaLikeDislike : {}", id);
        ideaLikeDislikeService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
