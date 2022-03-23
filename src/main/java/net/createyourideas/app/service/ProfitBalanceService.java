package net.createyourideas.app.service;

import java.util.List;
import java.util.Optional;
import net.createyourideas.app.domain.ProfitBalance;

/**
 * Service Interface for managing {@link ProfitBalance}.
 */
public interface ProfitBalanceService {
    /**
     * Save a profitBalance.
     *
     * @param profitBalance the entity to save.
     * @return the persisted entity.
     */
    ProfitBalance save(ProfitBalance profitBalance);

    /**
     * Partially updates a profitBalance.
     *
     * @param profitBalance the entity to update partially.
     * @return the persisted entity.
     */
    Optional<ProfitBalance> partialUpdate(ProfitBalance profitBalance);

    /**
     * Get all the profitBalances.
     *
     * @return the list of entities.
     */
    List<ProfitBalance> findAll();
    /**
     * Get all the ProfitBalance where Idea is {@code null}.
     *
     * @return the {@link List} of entities.
     */
    List<ProfitBalance> findAllWhereIdeaIsNull();

    /**
     * Get the "id" profitBalance.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<ProfitBalance> findOne(Long id);

    /**
     * Delete the "id" profitBalance.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
