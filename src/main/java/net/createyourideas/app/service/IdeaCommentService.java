package net.createyourideas.app.service;

import java.util.List;
import java.util.Optional;
import net.createyourideas.app.domain.IdeaComment;

/**
 * Service Interface for managing {@link IdeaComment}.
 */
public interface IdeaCommentService {
    /**
     * Save a ideaComment.
     *
     * @param ideaComment the entity to save.
     * @return the persisted entity.
     */
    IdeaComment save(IdeaComment ideaComment);

    /**
     * Partially updates a ideaComment.
     *
     * @param ideaComment the entity to update partially.
     * @return the persisted entity.
     */
    Optional<IdeaComment> partialUpdate(IdeaComment ideaComment);

    /**
     * Get all the ideaComments.
     *
     * @return the list of entities.
     */
    List<IdeaComment> findAll();

    /**
     * Get the "id" ideaComment.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<IdeaComment> findOne(Long id);

    /**
     * Delete the "id" ideaComment.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
