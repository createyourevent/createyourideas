package net.createyourideas.app.service.impl;

import java.util.List;
import java.util.Optional;
import net.createyourideas.app.domain.Idea;
import net.createyourideas.app.repository.IdeaExtRepository;
import net.createyourideas.app.repository.IdeaRepository;
import net.createyourideas.app.service.IdeaExtService;
import net.createyourideas.app.service.IdeaService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Idea}.
 */
@Service
@Transactional
public class IdeaExtServiceImpl implements IdeaExtService {

    private final Logger log = LoggerFactory.getLogger(IdeaServiceImpl.class);

    private final IdeaExtRepository ideaExtRepository;

    public IdeaExtServiceImpl(IdeaExtRepository ideaExtRepository) {
        this.ideaExtRepository = ideaExtRepository;
    }

    @Override
    public List<Idea> findAllByActiveTrue() {
        return ideaExtRepository.findAllByActiveTrue();
    }

    @Override
    public List<Idea> findAllByActiveFalse() {
        return ideaExtRepository.findAllByActiveFalse();
    }

    @Override
    public List<Idea> findByUserIsCurrentUser() {
        return ideaExtRepository.findByUserIsCurrentUser();
    }

    @Override
    public List<Idea> findAll() {
        return ideaExtRepository.findAll();
    }

    @Override
    public Idea findOneById(Long id) {
        return ideaExtRepository.findOneById(id);
    }

    @Override
    public Idea findAllByActiveTrueEagerDonations(Long id) {
        return ideaExtRepository.findAllByActiveTrueEagerDonations(id);
    }

    @Override
    public Idea findAllByActiveTrueEagerEmployees(Long id) {
        return ideaExtRepository.findAllByActiveTrueEagerEmployees(id);
    }

    @Override
    public Idea findAllByActiveTrueEagerEmployeesAndApplication(Long id) {
        return ideaExtRepository.findAllByActiveTrueEagerEmployeesAndApplication(id);
    }

    @Override
    public Idea findOneByActiveTrueAndId(Long id) {
        return ideaExtRepository.findOneByActiveTrueAndId(id);
    }


}
