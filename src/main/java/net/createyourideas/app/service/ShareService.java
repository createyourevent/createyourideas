package net.createyourideas.app.service;

import java.util.List;
import java.util.Optional;
import net.createyourideas.app.domain.Share;

/**
 * Service Interface for managing {@link Share}.
 */
public interface ShareService {
    /**
     * Save a share.
     *
     * @param share the entity to save.
     * @return the persisted entity.
     */
    Share save(Share share);

    /**
     * Partially updates a share.
     *
     * @param share the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Share> partialUpdate(Share share);

    /**
     * Get all the shares.
     *
     * @return the list of entities.
     */
    List<Share> findAll();

    /**
     * Get the "id" share.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Share> findOne(Long id);

    /**
     * Delete the "id" share.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
