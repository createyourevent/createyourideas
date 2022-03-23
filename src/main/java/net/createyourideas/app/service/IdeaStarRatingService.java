package net.createyourideas.app.service;

import java.util.List;
import java.util.Optional;
import net.createyourideas.app.domain.IdeaStarRating;

/**
 * Service Interface for managing {@link IdeaStarRating}.
 */
public interface IdeaStarRatingService {
    /**
     * Save a ideaStarRating.
     *
     * @param ideaStarRating the entity to save.
     * @return the persisted entity.
     */
    IdeaStarRating save(IdeaStarRating ideaStarRating);

    /**
     * Partially updates a ideaStarRating.
     *
     * @param ideaStarRating the entity to update partially.
     * @return the persisted entity.
     */
    Optional<IdeaStarRating> partialUpdate(IdeaStarRating ideaStarRating);

    /**
     * Get all the ideaStarRatings.
     *
     * @return the list of entities.
     */
    List<IdeaStarRating> findAll();

    /**
     * Get the "id" ideaStarRating.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<IdeaStarRating> findOne(Long id);

    /**
     * Delete the "id" ideaStarRating.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
