package net.createyourideas.app.service;

import java.util.List;
import java.util.Optional;
import net.createyourideas.app.domain.IdeaLikeDislike;

/**
 * Service Interface for managing {@link IdeaLikeDislike}.
 */
public interface IdeaLikeDislikeService {
    /**
     * Save a ideaLikeDislike.
     *
     * @param ideaLikeDislike the entity to save.
     * @return the persisted entity.
     */
    IdeaLikeDislike save(IdeaLikeDislike ideaLikeDislike);

    /**
     * Partially updates a ideaLikeDislike.
     *
     * @param ideaLikeDislike the entity to update partially.
     * @return the persisted entity.
     */
    Optional<IdeaLikeDislike> partialUpdate(IdeaLikeDislike ideaLikeDislike);

    /**
     * Get all the ideaLikeDislikes.
     *
     * @return the list of entities.
     */
    List<IdeaLikeDislike> findAll();

    /**
     * Get the "id" ideaLikeDislike.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<IdeaLikeDislike> findOne(Long id);

    /**
     * Delete the "id" ideaLikeDislike.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
