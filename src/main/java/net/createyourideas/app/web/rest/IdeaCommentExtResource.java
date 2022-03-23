package net.createyourideas.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import net.createyourideas.app.domain.IdeaComment;
import net.createyourideas.app.repository.IdeaCommentExtRepository;
import net.createyourideas.app.repository.IdeaCommentRepository;
import net.createyourideas.app.service.IdeaCommentExtService;
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
public class IdeaCommentExtResource {

    private final Logger log = LoggerFactory.getLogger(IdeaCommentExtResource.class);

    private static final String ENTITY_NAME = "ideaComment";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final IdeaCommentExtService ideaCommentExtService;

    private final IdeaCommentExtRepository ideaCommentExtRepository;

    public IdeaCommentExtResource(IdeaCommentExtService ideaCommentExtService, IdeaCommentExtRepository ideaCommentExtRepository) {
        this.ideaCommentExtService = ideaCommentExtService;
        this.ideaCommentExtRepository = ideaCommentExtRepository;
    }



    @GetMapping("/idea-comments/{id}/findAllByIdeaId")
    public List<IdeaComment> getIdeaComment(@PathVariable Long id) {
        log.debug("REST request to get IdeaComment : {}", id);
        List<IdeaComment> ideaComments = ideaCommentExtService.findAllByIdeaId(id);
        return ideaComments;
    }

}
