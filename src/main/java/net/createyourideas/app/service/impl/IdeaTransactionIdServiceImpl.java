package net.createyourideas.app.service.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import net.createyourideas.app.domain.IdeaTransactionId;
import net.createyourideas.app.repository.IdeaTransactionIdRepository;
import net.createyourideas.app.service.IdeaTransactionIdService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link IdeaTransactionId}.
 */
@Service
@Transactional
public class IdeaTransactionIdServiceImpl implements IdeaTransactionIdService {

    private final Logger log = LoggerFactory.getLogger(IdeaTransactionIdServiceImpl.class);

    private final IdeaTransactionIdRepository ideaTransactionIdRepository;

    public IdeaTransactionIdServiceImpl(IdeaTransactionIdRepository ideaTransactionIdRepository) {
        this.ideaTransactionIdRepository = ideaTransactionIdRepository;
    }

    @Override
    public IdeaTransactionId save(IdeaTransactionId ideaTransactionId) {
        log.debug("Request to save IdeaTransactionId : {}", ideaTransactionId);
        return ideaTransactionIdRepository.save(ideaTransactionId);
    }

    @Override
    public Optional<IdeaTransactionId> partialUpdate(IdeaTransactionId ideaTransactionId) {
        log.debug("Request to partially update IdeaTransactionId : {}", ideaTransactionId);

        return ideaTransactionIdRepository
            .findById(ideaTransactionId.getId())
            .map(existingIdeaTransactionId -> {
                if (ideaTransactionId.getTransactionId() != null) {
                    existingIdeaTransactionId.setTransactionId(ideaTransactionId.getTransactionId());
                }
                if (ideaTransactionId.getRefNo() != null) {
                    existingIdeaTransactionId.setRefNo(ideaTransactionId.getRefNo());
                }
                if (ideaTransactionId.getDate() != null) {
                    existingIdeaTransactionId.setDate(ideaTransactionId.getDate());
                }

                return existingIdeaTransactionId;
            })
            .map(ideaTransactionIdRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<IdeaTransactionId> findAll() {
        log.debug("Request to get all IdeaTransactionIds");
        return ideaTransactionIdRepository.findAll();
    }

    /**
     *  Get all the ideaTransactionIds where Idea is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<IdeaTransactionId> findAllWhereIdeaIsNull() {
        log.debug("Request to get all ideaTransactionIds where Idea is null");
        return StreamSupport
            .stream(ideaTransactionIdRepository.findAll().spliterator(), false)
            .filter(ideaTransactionId -> ideaTransactionId.getIdea() == null)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<IdeaTransactionId> findOne(Long id) {
        log.debug("Request to get IdeaTransactionId : {}", id);
        return ideaTransactionIdRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete IdeaTransactionId : {}", id);
        ideaTransactionIdRepository.deleteById(id);
    }
}
