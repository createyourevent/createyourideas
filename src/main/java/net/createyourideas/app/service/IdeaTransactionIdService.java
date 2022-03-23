package net.createyourideas.app.service;

import java.util.List;
import java.util.Optional;
import net.createyourideas.app.domain.IdeaTransactionId;

/**
 * Service Interface for managing {@link IdeaTransactionId}.
 */
public interface IdeaTransactionIdService {
    /**
     * Save a ideaTransactionId.
     *
     * @param ideaTransactionId the entity to save.
     * @return the persisted entity.
     */
    IdeaTransactionId save(IdeaTransactionId ideaTransactionId);

    /**
     * Partially updates a ideaTransactionId.
     *
     * @param ideaTransactionId the entity to update partially.
     * @return the persisted entity.
     */
    Optional<IdeaTransactionId> partialUpdate(IdeaTransactionId ideaTransactionId);

    /**
     * Get all the ideaTransactionIds.
     *
     * @return the list of entities.
     */
    List<IdeaTransactionId> findAll();
    /**
     * Get all the IdeaTransactionId where Idea is {@code null}.
     *
     * @return the {@link List} of entities.
     */
    List<IdeaTransactionId> findAllWhereIdeaIsNull();

    /**
     * Get the "id" ideaTransactionId.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<IdeaTransactionId> findOne(Long id);

    /**
     * Delete the "id" ideaTransactionId.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
