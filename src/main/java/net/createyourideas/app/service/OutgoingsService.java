package net.createyourideas.app.service;

import java.util.Optional;
import net.createyourideas.app.domain.Outgoings;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Outgoings}.
 */
public interface OutgoingsService {
    /**
     * Save a outgoings.
     *
     * @param outgoings the entity to save.
     * @return the persisted entity.
     */
    Outgoings save(Outgoings outgoings);

    /**
     * Partially updates a outgoings.
     *
     * @param outgoings the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Outgoings> partialUpdate(Outgoings outgoings);

    /**
     * Get all the outgoings.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Outgoings> findAll(Pageable pageable);

    /**
     * Get all the outgoings with eager load of many-to-many relationships.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Outgoings> findAllWithEagerRelationships(Pageable pageable);

    /**
     * Get the "id" outgoings.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Outgoings> findOne(Long id);

    /**
     * Delete the "id" outgoings.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
