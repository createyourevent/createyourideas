package net.createyourideas.app.service.impl;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import net.createyourideas.app.domain.Worksheet;
import net.createyourideas.app.repository.WorksheetExtRepository;
import net.createyourideas.app.repository.WorksheetRepository;
import net.createyourideas.app.service.WorksheetExtService;
import net.createyourideas.app.service.WorksheetService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Worksheet}.
 */
@Service
@Transactional
public class WorksheetExtServiceImpl implements WorksheetExtService {

    private final Logger log = LoggerFactory.getLogger(WorksheetServiceImpl.class);

    private final WorksheetExtRepository worksheetExtRepository;

    public WorksheetExtServiceImpl(WorksheetExtRepository worksheetExtRepository) {
        this.worksheetExtRepository = worksheetExtRepository;
    }

    @Override
    public List<Worksheet> findAllByIdeaId(Long ideaId) {
        return worksheetExtRepository.findAllByIdeaId(ideaId);
    }

    @Override
    public List<Worksheet> findAllWorksheetByIdeaIdAndDate(Long id, ZonedDateTime now) {
        return this.worksheetExtRepository.findAllWorksheetByIdeaIdAndDate(id, now);
    }

}
