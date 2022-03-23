package net.createyourideas.app.service.impl;

import java.util.List;
import java.util.Optional;
import net.createyourideas.app.domain.MonthlyOutgoingsInvoice;
import net.createyourideas.app.repository.MonthlyOutgoingsInvoiceRepository;
import net.createyourideas.app.service.MonthlyOutgoingsInvoiceService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link MonthlyOutgoingsInvoice}.
 */
@Service
@Transactional
public class MonthlyOutgoingsInvoiceServiceImpl implements MonthlyOutgoingsInvoiceService {

    private final Logger log = LoggerFactory.getLogger(MonthlyOutgoingsInvoiceServiceImpl.class);

    private final MonthlyOutgoingsInvoiceRepository monthlyOutgoingsInvoiceRepository;

    public MonthlyOutgoingsInvoiceServiceImpl(MonthlyOutgoingsInvoiceRepository monthlyOutgoingsInvoiceRepository) {
        this.monthlyOutgoingsInvoiceRepository = monthlyOutgoingsInvoiceRepository;
    }

    @Override
    public MonthlyOutgoingsInvoice save(MonthlyOutgoingsInvoice monthlyOutgoingsInvoice) {
        log.debug("Request to save MonthlyOutgoingsInvoice : {}", monthlyOutgoingsInvoice);
        return monthlyOutgoingsInvoiceRepository.save(monthlyOutgoingsInvoice);
    }

    @Override
    public Optional<MonthlyOutgoingsInvoice> partialUpdate(MonthlyOutgoingsInvoice monthlyOutgoingsInvoice) {
        log.debug("Request to partially update MonthlyOutgoingsInvoice : {}", monthlyOutgoingsInvoice);

        return monthlyOutgoingsInvoiceRepository
            .findById(monthlyOutgoingsInvoice.getId())
            .map(existingMonthlyOutgoingsInvoice -> {
                if (monthlyOutgoingsInvoice.getTotal() != null) {
                    existingMonthlyOutgoingsInvoice.setTotal(monthlyOutgoingsInvoice.getTotal());
                }
                if (monthlyOutgoingsInvoice.getDate() != null) {
                    existingMonthlyOutgoingsInvoice.setDate(monthlyOutgoingsInvoice.getDate());
                }

                return existingMonthlyOutgoingsInvoice;
            })
            .map(monthlyOutgoingsInvoiceRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MonthlyOutgoingsInvoice> findAll() {
        log.debug("Request to get all MonthlyOutgoingsInvoices");
        return monthlyOutgoingsInvoiceRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<MonthlyOutgoingsInvoice> findOne(Long id) {
        log.debug("Request to get MonthlyOutgoingsInvoice : {}", id);
        return monthlyOutgoingsInvoiceRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete MonthlyOutgoingsInvoice : {}", id);
        monthlyOutgoingsInvoiceRepository.deleteById(id);
    }
}
