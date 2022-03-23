package net.createyourideas.app.service;

import java.util.List;
import java.util.Optional;
import net.createyourideas.app.domain.Worksheet;

/**
 * Service Interface for managing {@link Worksheet}.
 */
public interface WorksheetService {
    /**
     * Save a worksheet.
     *
     * @param worksheet the entity to save.
     * @return the persisted entity.
     */
    Worksheet save(Worksheet worksheet);

    /**
     * Partially updates a worksheet.
     *
     * @param worksheet the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Worksheet> partialUpdate(Worksheet worksheet);

    /**
     * Get all the worksheets.
     *
     * @return the list of entities.
     */
    List<Worksheet> findAll();

    /**
     * Get the "id" worksheet.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Worksheet> findOne(Long id);

    /**
     * Delete the "id" worksheet.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
