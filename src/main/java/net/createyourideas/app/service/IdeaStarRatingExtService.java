package net.createyourideas.app.service;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import net.createyourideas.app.domain.IdeaStarRating;

import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link IdeaStarRating}.
 */
public interface IdeaStarRatingExtService {
    List<IdeaStarRating> findIdeaStarRatingsByIdeaId(Long ideaId);

    IdeaStarRating findByIdeaIdAndUserId(Long ideaId, String userId);
}
