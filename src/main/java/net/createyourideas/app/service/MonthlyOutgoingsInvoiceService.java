package net.createyourideas.app.service;

import java.util.List;
import java.util.Optional;
import net.createyourideas.app.domain.MonthlyOutgoingsInvoice;

/**
 * Service Interface for managing {@link MonthlyOutgoingsInvoice}.
 */
public interface MonthlyOutgoingsInvoiceService {
    /**
     * Save a monthlyOutgoingsInvoice.
     *
     * @param monthlyOutgoingsInvoice the entity to save.
     * @return the persisted entity.
     */
    MonthlyOutgoingsInvoice save(MonthlyOutgoingsInvoice monthlyOutgoingsInvoice);

    /**
     * Partially updates a monthlyOutgoingsInvoice.
     *
     * @param monthlyOutgoingsInvoice the entity to update partially.
     * @return the persisted entity.
     */
    Optional<MonthlyOutgoingsInvoice> partialUpdate(MonthlyOutgoingsInvoice monthlyOutgoingsInvoice);

    /**
     * Get all the monthlyOutgoingsInvoices.
     *
     * @return the list of entities.
     */
    List<MonthlyOutgoingsInvoice> findAll();

    /**
     * Get the "id" monthlyOutgoingsInvoice.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<MonthlyOutgoingsInvoice> findOne(Long id);

    /**
     * Delete the "id" monthlyOutgoingsInvoice.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
