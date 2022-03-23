package net.createyourideas.app.service;

import java.util.Optional;
import net.createyourideas.app.domain.Idea;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Idea}.
 */
public interface IdeaService {
    /**
     * Save a idea.
     *
     * @param idea the entity to save.
     * @return the persisted entity.
     */
    Idea save(Idea idea);

    /**
     * Partially updates a idea.
     *
     * @param idea the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Idea> partialUpdate(Idea idea);

    /**
     * Get all the ideas.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Idea> findAll(Pageable pageable);

    /**
     * Get all the ideas with eager load of many-to-many relationships.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Idea> findAllWithEagerRelationships(Pageable pageable);

    /**
     * Get the "id" idea.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Idea> findOne(Long id);

    /**
     * Delete the "id" idea.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
