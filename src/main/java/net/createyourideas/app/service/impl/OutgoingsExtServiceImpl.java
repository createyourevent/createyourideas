package net.createyourideas.app.service.impl;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import net.createyourideas.app.domain.Outgoings;
import net.createyourideas.app.repository.OutgoingsExtRepository;
import net.createyourideas.app.repository.OutgoingsRepository;
import net.createyourideas.app.service.OutgoingsExtService;
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
public class OutgoingsExtServiceImpl implements OutgoingsExtService {

    private final Logger log = LoggerFactory.getLogger(OutgoingsServiceImpl.class);

    private final OutgoingsExtRepository outgoingsExtRepository;

    public OutgoingsExtServiceImpl(OutgoingsExtRepository outgoingsExtRepository) {
        this.outgoingsExtRepository = outgoingsExtRepository;
    }

    @Override
    public List<Outgoings> findAllByIdeaId(Long ideaId) {
        return this.outgoingsExtRepository.findAllByIdeaId(ideaId);
    }

    @Override
    public List<Outgoings> findAllOutgoingByIdeaIdAndDate(Long id, ZonedDateTime now) {
        return this.outgoingsExtRepository.findAllOutgoingByIdeaIdAndDate(id, now);
    }

}
