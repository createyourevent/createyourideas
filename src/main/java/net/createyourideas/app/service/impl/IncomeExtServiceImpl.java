package net.createyourideas.app.service.impl;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import net.createyourideas.app.domain.Income;
import net.createyourideas.app.repository.IncomeExtRepository;
import net.createyourideas.app.repository.IncomeRepository;
import net.createyourideas.app.service.IncomeExtService;
import net.createyourideas.app.service.IncomeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Income}.
 */
@Service
@Transactional
public class IncomeExtServiceImpl implements IncomeExtService {

    private final Logger log = LoggerFactory.getLogger(IncomeExtServiceImpl.class);

    private final IncomeExtRepository incomeExtRepository;

    public IncomeExtServiceImpl(IncomeExtRepository incomeExtRepository) {
        this.incomeExtRepository = incomeExtRepository;
    }

    @Override
    public List<Income> findAllByIdeaId(Long ideaId) {
        return incomeExtRepository.findAllByIdeaId(ideaId);
    }

    @Override
    public List<Income> findAllIncomeByIdeaIdAndDate(Long id, ZonedDateTime now) {
        List<Income> l = incomeExtRepository.findAllIncomeByIdeaIdAndDate(id, now);
        return l;
    }


}
