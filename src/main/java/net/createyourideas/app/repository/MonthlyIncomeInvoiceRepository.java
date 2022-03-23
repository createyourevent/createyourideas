package net.createyourideas.app.repository;

import net.createyourideas.app.domain.MonthlyIncomeInvoice;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the MonthlyIncomeInvoice entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MonthlyIncomeInvoiceRepository extends JpaRepository<MonthlyIncomeInvoice, Long> {}
