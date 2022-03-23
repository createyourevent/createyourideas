package net.createyourideas.app.service;

import java.util.List;
import java.util.Optional;
import net.createyourideas.app.domain.MonthlyIncomeInvoice;

/**
 * Service Interface for managing {@link MonthlyIncomeInvoice}.
 */
public interface MonthlyIncomeInvoiceService {
    /**
     * Save a monthlyIncomeInvoice.
     *
     * @param monthlyIncomeInvoice the entity to save.
     * @return the persisted entity.
     */
    MonthlyIncomeInvoice save(MonthlyIncomeInvoice monthlyIncomeInvoice);

    /**
     * Partially updates a monthlyIncomeInvoice.
     *
     * @param monthlyIncomeInvoice the entity to update partially.
     * @return the persisted entity.
     */
    Optional<MonthlyIncomeInvoice> partialUpdate(MonthlyIncomeInvoice monthlyIncomeInvoice);

    /**
     * Get all the monthlyIncomeInvoices.
     *
     * @return the list of entities.
     */
    List<MonthlyIncomeInvoice> findAll();

    /**
     * Get the "id" monthlyIncomeInvoice.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<MonthlyIncomeInvoice> findOne(Long id);

    /**
     * Delete the "id" monthlyIncomeInvoice.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
