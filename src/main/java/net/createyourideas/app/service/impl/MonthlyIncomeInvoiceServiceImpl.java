package net.createyourideas.app.service.impl;

import java.util.List;
import java.util.Optional;
import net.createyourideas.app.domain.MonthlyIncomeInvoice;
import net.createyourideas.app.repository.MonthlyIncomeInvoiceRepository;
import net.createyourideas.app.service.MonthlyIncomeInvoiceService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link MonthlyIncomeInvoice}.
 */
@Service
@Transactional
public class MonthlyIncomeInvoiceServiceImpl implements MonthlyIncomeInvoiceService {

    private final Logger log = LoggerFactory.getLogger(MonthlyIncomeInvoiceServiceImpl.class);

    private final MonthlyIncomeInvoiceRepository monthlyIncomeInvoiceRepository;

    public MonthlyIncomeInvoiceServiceImpl(MonthlyIncomeInvoiceRepository monthlyIncomeInvoiceRepository) {
        this.monthlyIncomeInvoiceRepository = monthlyIncomeInvoiceRepository;
    }

    @Override
    public MonthlyIncomeInvoice save(MonthlyIncomeInvoice monthlyIncomeInvoice) {
        log.debug("Request to save MonthlyIncomeInvoice : {}", monthlyIncomeInvoice);
        return monthlyIncomeInvoiceRepository.save(monthlyIncomeInvoice);
    }

    @Override
    public Optional<MonthlyIncomeInvoice> partialUpdate(MonthlyIncomeInvoice monthlyIncomeInvoice) {
        log.debug("Request to partially update MonthlyIncomeInvoice : {}", monthlyIncomeInvoice);

        return monthlyIncomeInvoiceRepository
            .findById(monthlyIncomeInvoice.getId())
            .map(existingMonthlyIncomeInvoice -> {
                if (monthlyIncomeInvoice.getTotal() != null) {
                    existingMonthlyIncomeInvoice.setTotal(monthlyIncomeInvoice.getTotal());
                }
                if (monthlyIncomeInvoice.getDate() != null) {
                    existingMonthlyIncomeInvoice.setDate(monthlyIncomeInvoice.getDate());
                }

                return existingMonthlyIncomeInvoice;
            })
            .map(monthlyIncomeInvoiceRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MonthlyIncomeInvoice> findAll() {
        log.debug("Request to get all MonthlyIncomeInvoices");
        return monthlyIncomeInvoiceRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<MonthlyIncomeInvoice> findOne(Long id) {
        log.debug("Request to get MonthlyIncomeInvoice : {}", id);
        return monthlyIncomeInvoiceRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete MonthlyIncomeInvoice : {}", id);
        monthlyIncomeInvoiceRepository.deleteById(id);
    }
}
