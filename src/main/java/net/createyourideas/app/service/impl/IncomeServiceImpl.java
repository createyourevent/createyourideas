package net.createyourideas.app.service.impl;

import java.util.Optional;
import net.createyourideas.app.domain.Income;
import net.createyourideas.app.repository.IncomeRepository;
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
public class IncomeServiceImpl implements IncomeService {

    private final Logger log = LoggerFactory.getLogger(IncomeServiceImpl.class);

    private final IncomeRepository incomeRepository;

    public IncomeServiceImpl(IncomeRepository incomeRepository) {
        this.incomeRepository = incomeRepository;
    }

    @Override
    public Income save(Income income) {
        log.debug("Request to save Income : {}", income);
        return incomeRepository.save(income);
    }

    @Override
    public Optional<Income> partialUpdate(Income income) {
        log.debug("Request to partially update Income : {}", income);

        return incomeRepository
            .findById(income.getId())
            .map(existingIncome -> {
                if (income.getTitle() != null) {
                    existingIncome.setTitle(income.getTitle());
                }
                if (income.getDescription() != null) {
                    existingIncome.setDescription(income.getDescription());
                }
                if (income.getDate() != null) {
                    existingIncome.setDate(income.getDate());
                }
                if (income.getValue() != null) {
                    existingIncome.setValue(income.getValue());
                }
                if (income.getBilled() != null) {
                    existingIncome.setBilled(income.getBilled());
                }
                if (income.getFromParentIdea() != null) {
                    existingIncome.setFromParentIdea(income.getFromParentIdea());
                }
                if (income.getAuto() != null) {
                    existingIncome.setAuto(income.getAuto());
                }

                return existingIncome;
            })
            .map(incomeRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Income> findAll(Pageable pageable) {
        log.debug("Request to get all Incomes");
        return incomeRepository.findAll(pageable);
    }

    public Page<Income> findAllWithEagerRelationships(Pageable pageable) {
        return incomeRepository.findAllWithEagerRelationships(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Income> findOne(Long id) {
        log.debug("Request to get Income : {}", id);
        return incomeRepository.findOneWithEagerRelationships(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Income : {}", id);
        incomeRepository.deleteById(id);
    }
}
