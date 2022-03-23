package net.createyourideas.app.service.impl;

import java.util.Optional;
import net.createyourideas.app.domain.Balance;
import net.createyourideas.app.repository.BalanceRepository;
import net.createyourideas.app.service.BalanceService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Balance}.
 */
@Service
@Transactional
public class BalanceServiceImpl implements BalanceService {

    private final Logger log = LoggerFactory.getLogger(BalanceServiceImpl.class);

    private final BalanceRepository balanceRepository;

    public BalanceServiceImpl(BalanceRepository balanceRepository) {
        this.balanceRepository = balanceRepository;
    }

    @Override
    public Balance save(Balance balance) {
        log.debug("Request to save Balance : {}", balance);
        return balanceRepository.save(balance);
    }

    @Override
    public Optional<Balance> partialUpdate(Balance balance) {
        log.debug("Request to partially update Balance : {}", balance);

        return balanceRepository
            .findById(balance.getId())
            .map(existingBalance -> {
                if (balance.getDailyBalance() != null) {
                    existingBalance.setDailyBalance(balance.getDailyBalance());
                }
                if (balance.getNetProfit() != null) {
                    existingBalance.setNetProfit(balance.getNetProfit());
                }
                if (balance.getDate() != null) {
                    existingBalance.setDate(balance.getDate());
                }
                if (balance.getBilled() != null) {
                    existingBalance.setBilled(balance.getBilled());
                }

                return existingBalance;
            })
            .map(balanceRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Balance> findAll(Pageable pageable) {
        log.debug("Request to get all Balances");
        return balanceRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Balance> findOne(Long id) {
        log.debug("Request to get Balance : {}", id);
        return balanceRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Balance : {}", id);
        balanceRepository.deleteById(id);
    }
}
