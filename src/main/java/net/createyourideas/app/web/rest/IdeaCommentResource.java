package net.createyourideas.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import net.createyourideas.app.domain.IdeaComment;
import net.createyourideas.app.repository.IdeaCommentRepository;
import net.createyourideas.app.service.IdeaCommentService;
import net.createyourideas.app.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link net.createyourideas.app.domain.IdeaComment}.
 */
@RestController
@RequestMapping("/api")
public class IdeaCommentResource {

    private final Logger log = LoggerFactory.getLogger(IdeaCommentResource.class);

    private static final String ENTITY_NAME = "ideaComment";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final IdeaCommentService ideaCommentService;

    private final IdeaCommentRepository ideaCommentRepository;

    public IdeaCommentResource(IdeaCommentService ideaCommentService, IdeaCommentRepository ideaCommentRepository) {
        this.ideaCommentService = ideaCommentService;
        this.ideaCommentRepository = ideaCommentRepository;
    }

    /**
     * {@code POST  /idea-comments} : Create a new ideaComment.
     *
     * @param ideaComment the ideaComment to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new ideaComment, or with status {@code 400 (Bad Request)} if the ideaComment has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/idea-comments")
    public ResponseEntity<IdeaComment> createIdeaComment(@RequestBody IdeaComment ideaComment) throws URISyntaxException {
        log.debug("REST request to save IdeaComment : {}", ideaComment);
        if (ideaComment.getId() != null) {
            throw new BadRequestAlertException("A new ideaComment cannot already have an ID", ENTITY_NAME, "idexists");
        }
        IdeaComment result = ideaCommentService.save(ideaComment);
        return ResponseEntity
            .created(new URI("/api/idea-comments/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /idea-comments/:id} : Updates an existing ideaComment.
     *
     * @param id the id of the ideaComment to save.
     * @param ideaComment the ideaComment to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ideaComment,
     * or with status {@code 400 (Bad Request)} if the ideaComment is not valid,
     * or with status {@code 500 (Internal Server Error)} if the ideaComment couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/idea-comments/{id}")
    public ResponseEntity<IdeaComment> updateIdeaComment(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody IdeaComment ideaComment
    ) throws URISyntaxException {
        log.debug("REST request to update IdeaComment : {}, {}", id, ideaComment);
        if (ideaComment.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ideaComment.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!ideaCommentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        IdeaComment result = ideaCommentService.save(ideaComment);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, ideaComment.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /idea-comments/:id} : Partial updates given fields of an existing ideaComment, field will ignore if it is null
     *
     * @param id the id of the ideaComment to save.
     * @param ideaComment the ideaComment to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ideaComment,
     * or with status {@code 400 (Bad Request)} if the ideaComment is not valid,
     * or with status {@code 404 (Not Found)} if the ideaComment is not found,
     * or with status {@code 500 (Internal Server Error)} if the ideaComment couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/idea-comments/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<IdeaComment> partialUpdateIdeaComment(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody IdeaComment ideaComment
    ) throws URISyntaxException {
        log.debug("REST request to partial update IdeaComment partially : {}, {}", id, ideaComment);
        if (ideaComment.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ideaComment.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!ideaCommentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<IdeaComment> result = ideaCommentService.partialUpdate(ideaComment);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, ideaComment.getId().toString())
        );
    }

    /**
     * {@code GET  /idea-comments} : get all the ideaComments.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of ideaComments in body.
     */
    @GetMapping("/idea-comments")
    public List<IdeaComment> getAllIdeaComments() {
        log.debug("REST request to get all IdeaComments");
        return ideaCommentService.findAll();
    }

    /**
     * {@code GET  /idea-comments/:id} : get the "id" ideaComment.
     *
     * @param id the id of the ideaComment to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the ideaComment, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/idea-comments/{id}")
    public ResponseEntity<IdeaComment> getIdeaComment(@PathVariable Long id) {
        log.debug("REST request to get IdeaComment : {}", id);
        Optional<IdeaComment> ideaComment = ideaCommentService.findOne(id);
        return ResponseUtil.wrapOrNotFound(ideaComment);
    }

    /**
     * {@code DELETE  /idea-comments/:id} : delete the "id" ideaComment.
     *
     * @param id the id of the ideaComment to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/idea-comments/{id}")
    public ResponseEntity<Void> deleteIdeaComment(@PathVariable Long id) {
        log.debug("REST request to delete IdeaComment : {}", id);
        ideaCommentService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
