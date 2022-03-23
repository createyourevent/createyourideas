package net.createyourideas.app.web.rest;



import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import net.createyourideas.app.domain.IdeaLikeDislike;
import net.createyourideas.app.service.IdeaLikeDislikeExtensionService;

import java.util.List;


/**
 * REST controller for managing {@link org.createyourevent.domain.IdeaLikeDislike}.
 */
@RestController
@RequestMapping("/api")
public class IdeaLikeDislikeExtensionResource {

    private final Logger log = LoggerFactory.getLogger(IdeaLikeDislikeResource.class);

    private static final String ENTITY_NAME = "ideaLikeDislike";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final IdeaLikeDislikeExtensionService ideaLikeDislikeExtensionService;

    public IdeaLikeDislikeExtensionResource(IdeaLikeDislikeExtensionService ideaLikeDislikeExtensionService) {
        this.ideaLikeDislikeExtensionService = ideaLikeDislikeExtensionService;
    }

    @GetMapping("/idea-like-dislikes/{ideaId}/getIdeaLikeDislikeByIdeaId")
    public List<IdeaLikeDislike> getIdeaLikeDislikeByIdeaId(@PathVariable Long ideaId) {
        log.debug("REST request to get IdeaLikeDislike by Idea ID : {}", ideaId);
        List<IdeaLikeDislike> ideaLikeDislikes = ideaLikeDislikeExtensionService.findAllByIdeaId(ideaId);
        return ideaLikeDislikes;
    }

    @GetMapping("/idea-like-dislikes/{ideaId}/{userId}/getIdeaLikeDislikeByIdeaIdAndUserId")
    public List<IdeaLikeDislike> getIdeaLikeDislikeByIdeaIdAndUserId(@PathVariable Long ideaId, @PathVariable String userId) {
        log.debug("REST request to get IdeaLikeDislike by Idea ID and User ID");
        List<IdeaLikeDislike> ideaLikeDislikes = ideaLikeDislikeExtensionService.findAllByIdeaIdAndUserId(ideaId, userId);
        return ideaLikeDislikes;
    }
}
