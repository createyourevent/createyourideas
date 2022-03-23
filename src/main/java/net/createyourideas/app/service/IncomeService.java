package net.createyourideas.app.service;

import java.util.Optional;
import net.createyourideas.app.domain.Income;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Income}.
 */
public interface IncomeService {
    /**
     * Save a income.
     *
     * @param income the entity to save.
     * @return the persisted entity.
     */
    Income save(Income income);

    /**
     * Partially updates a income.
     *
     * @param income the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Income> partialUpdate(Income income);

    /**
     * Get all the incomes.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Income> findAll(Pageable pageable);

    /**
     * Get all the incomes with eager load of many-to-many relationships.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Income> findAllWithEagerRelationships(Pageable pageable);

    /**
     * Get the "id" income.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Income> findOne(Long id);

    /**
     * Delete the "id" income.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
