package net.createyourideas.app.service.impl;

import java.util.Optional;
import net.createyourideas.app.domain.Outgoings;
import net.createyourideas.app.repository.OutgoingsRepository;
import net.createyourideas.app.service.OutgoingsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Outgoings}.
 */
@Service
@Transactional
public class OutgoingsServiceImpl implements OutgoingsService {

    private final Logger log = LoggerFactory.getLogger(OutgoingsServiceImpl.class);

    private final OutgoingsRepository outgoingsRepository;

    public OutgoingsServiceImpl(OutgoingsRepository outgoingsRepository) {
        this.outgoingsRepository = outgoingsRepository;
    }

    @Override
    public Outgoings save(Outgoings outgoings) {
        log.debug("Request to save Outgoings : {}", outgoings);
        return outgoingsRepository.save(outgoings);
    }

    @Override
    public Optional<Outgoings> partialUpdate(Outgoings outgoings) {
        log.debug("Request to partially update Outgoings : {}", outgoings);

        return outgoingsRepository
            .findById(outgoings.getId())
            .map(existingOutgoings -> {
                if (outgoings.getTitle() != null) {
                    existingOutgoings.setTitle(outgoings.getTitle());
                }
                if (outgoings.getDescription() != null) {
                    existingOutgoings.setDescription(outgoings.getDescription());
                }
                if (outgoings.getDate() != null) {
                    existingOutgoings.setDate(outgoings.getDate());
                }
                if (outgoings.getValue() != null) {
                    existingOutgoings.setValue(outgoings.getValue());
                }
                if (outgoings.getBilled() != null) {
                    existingOutgoings.setBilled(outgoings.getBilled());
                }
                if (outgoings.getToChildIdea() != null) {
                    existingOutgoings.setToChildIdea(outgoings.getToChildIdea());
                }
                if (outgoings.getAuto() != null) {
                    existingOutgoings.setAuto(outgoings.getAuto());
                }

                return existingOutgoings;
            })
            .map(outgoingsRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Outgoings> findAll(Pageable pageable) {
        log.debug("Request to get all Outgoings");
        return outgoingsRepository.findAll(pageable);
    }

    public Page<Outgoings> findAllWithEagerRelationships(Pageable pageable) {
        return outgoingsRepository.findAllWithEagerRelationships(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Outgoings> findOne(Long id) {
        log.debug("Request to get Outgoings : {}", id);
        return outgoingsRepository.findOneWithEagerRelationships(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Outgoings : {}", id);
        outgoingsRepository.deleteById(id);
    }
}
