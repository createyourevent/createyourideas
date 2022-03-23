package net.createyourideas.app.service.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import net.createyourideas.app.domain.ProfitBalance;
import net.createyourideas.app.repository.ProfitBalanceRepository;
import net.createyourideas.app.service.ProfitBalanceService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link ProfitBalance}.
 */
@Service
@Transactional
public class ProfitBalanceServiceImpl implements ProfitBalanceService {

    private final Logger log = LoggerFactory.getLogger(ProfitBalanceServiceImpl.class);

    private final ProfitBalanceRepository profitBalanceRepository;

    public ProfitBalanceServiceImpl(ProfitBalanceRepository profitBalanceRepository) {
        this.profitBalanceRepository = profitBalanceRepository;
    }

    @Override
    public ProfitBalance save(ProfitBalance profitBalance) {
        log.debug("Request to save ProfitBalance : {}", profitBalance);
        return profitBalanceRepository.save(profitBalance);
    }

    @Override
    public Optional<ProfitBalance> partialUpdate(ProfitBalance profitBalance) {
        log.debug("Request to partially update ProfitBalance : {}", profitBalance);

        return profitBalanceRepository
            .findById(profitBalance.getId())
            .map(existingProfitBalance -> {
                if (profitBalance.getProfit() != null) {
                    existingProfitBalance.setProfit(profitBalance.getProfit());
                }
                if (profitBalance.getProfitToSpend() != null) {
                    existingProfitBalance.setProfitToSpend(profitBalance.getProfitToSpend());
                }
                if (profitBalance.getNetProfit() != null) {
                    existingProfitBalance.setNetProfit(profitBalance.getNetProfit());
                }
                if (profitBalance.getDate() != null) {
                    existingProfitBalance.setDate(profitBalance.getDate());
                }

                return existingProfitBalance;
            })
            .map(profitBalanceRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProfitBalance> findAll() {
        log.debug("Request to get all ProfitBalances");
        return profitBalanceRepository.findAll();
    }

    /**
     *  Get all the profitBalances where Idea is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<ProfitBalance> findAllWhereIdeaIsNull() {
        log.debug("Request to get all profitBalances where Idea is null");
        return StreamSupport
            .stream(profitBalanceRepository.findAll().spliterator(), false)
            .filter(profitBalance -> profitBalance.getIdea() == null)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ProfitBalance> findOne(Long id) {
        log.debug("Request to get ProfitBalance : {}", id);
        return profitBalanceRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete ProfitBalance : {}", id);
        profitBalanceRepository.deleteById(id);
    }
}
