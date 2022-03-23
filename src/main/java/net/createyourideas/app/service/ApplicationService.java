package net.createyourideas.app.service;

import java.util.List;
import java.util.Optional;
import net.createyourideas.app.domain.Application;

/**
 * Service Interface for managing {@link Application}.
 */
public interface ApplicationService {
    /**
     * Save a application.
     *
     * @param application the entity to save.
     * @return the persisted entity.
     */
    Application save(Application application);

    /**
     * Partially updates a application.
     *
     * @param application the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Application> partialUpdate(Application application);

    /**
     * Get all the applications.
     *
     * @return the list of entities.
     */
    List<Application> findAll();

    /**
     * Get the "id" application.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Application> findOne(Long id);

    /**
     * Delete the "id" application.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
