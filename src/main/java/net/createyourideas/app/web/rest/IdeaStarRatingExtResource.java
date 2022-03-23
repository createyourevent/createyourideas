package net.createyourideas.app.web.rest;


import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import net.createyourideas.app.domain.IdeaStarRating;
import net.createyourideas.app.service.IdeaStarRatingExtService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link org.createyourevent.domain.IdeaStarRating}.
 */
@RestController
@RequestMapping("/api")
public class IdeaStarRatingExtResource {

    private final Logger log = LoggerFactory.getLogger(IdeaStarRatingExtResource.class);

    private static final String ENTITY_NAME = "ideaStarRating";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final IdeaStarRatingExtService ideaStarRatingExtService;

    public IdeaStarRatingExtResource(IdeaStarRatingExtService ideaStarRatingExtService) {
        this.ideaStarRatingExtService = ideaStarRatingExtService;
    }



    /**
     * {@code GET  /idea-star-ratings} : get all the ideaStarRatings.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of ideaStarRatings in body.
     */
    @GetMapping("/idea-star-ratings/{ideaId}/findIdeaStarRatingsByIdeaId")
    public List<IdeaStarRating> findIdeaStarRatingsByIdeaId(@PathVariable Long ideaId) {
        log.debug("REST request to get a all of IdeaStarRatings by ideaid");
        List<IdeaStarRating> all = ideaStarRatingExtService.findIdeaStarRatingsByIdeaId(ideaId);
        return all;
    }

        /**
     * {@code GET  /idea-star-ratings} : get all the ideaStarRatings.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of ideaStarRatings in body.
     */
    @GetMapping("/idea-star-ratings/{ideaId}/{userId}/findIdeaStarRatingsByIdeaIdAndUserId")
    public IdeaStarRating findIdeaStarRatingsByIdeaIdAndUserId(@PathVariable Long ideaId, @PathVariable String userId) {
        log.debug("REST request to get a all of IdeaStarRatings by ideaid and userid");
        IdeaStarRating one = ideaStarRatingExtService.findByIdeaIdAndUserId(ideaId, userId);
        return one;
    }
}


