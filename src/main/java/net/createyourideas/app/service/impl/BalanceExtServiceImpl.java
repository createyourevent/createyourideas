package net.createyourideas.app.service.impl;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import net.createyourideas.app.domain.Balance;
import net.createyourideas.app.repository.BalanceExtRepository;
import net.createyourideas.app.repository.BalanceRepository;
import net.createyourideas.app.service.BalanceExtService;
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
public class BalanceExtServiceImpl implements BalanceExtService {

    private final Logger log = LoggerFactory.getLogger(BalanceExtServiceImpl.class);

    private final BalanceExtRepository balanceExtRepository;

    public BalanceExtServiceImpl(BalanceExtRepository balanceExtRepository) {
        this.balanceExtRepository = balanceExtRepository;
    }

    @Override
    public Balance findOneByIdeaIdAndDate(Long ideaId, LocalDate date) {
        return balanceExtRepository.findOneByIdeaIdAndDate(ideaId, date);
    }

    @Override
    public List<Balance> findAll() {
        return balanceExtRepository.findAll();
    }

    @Override
    public List<Balance> findAllByIdeaId(Long ideaId) {
        return balanceExtRepository.findAllByIdeaId(ideaId);
    }



}

