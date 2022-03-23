package net.createyourideas.app.repository;

import net.createyourideas.app.domain.MonthlyOutgoingsInvoice;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the MonthlyOutgoingsInvoice entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MonthlyOutgoingsInvoiceRepository extends JpaRepository<MonthlyOutgoingsInvoice, Long> {}
