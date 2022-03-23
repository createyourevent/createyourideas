package net.createyourideas.app.service;

import java.util.List;
import java.util.Optional;
import net.createyourideas.app.domain.Properties;

/**
 * Service Interface for managing {@link Properties}.
 */
public interface PropertiesService {
    /**
     * Save a properties.
     *
     * @param properties the entity to save.
     * @return the persisted entity.
     */
    Properties save(Properties properties);

    /**
     * Partially updates a properties.
     *
     * @param properties the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Properties> partialUpdate(Properties properties);

    /**
     * Get all the properties.
     *
     * @return the list of entities.
     */
    List<Properties> findAll();

    /**
     * Get the "id" properties.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Properties> findOne(Long id);

    /**
     * Delete the "id" properties.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
