package net.createyourideas.app.service;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import net.createyourideas.app.domain.Worksheet;

/**
 * Service Interface for managing {@link Worksheet}.
 */
public interface WorksheetExtService {
    List<Worksheet> findAllByIdeaId(Long ideaId);
    List<Worksheet> findAllWorksheetByIdeaIdAndDate(Long id, ZonedDateTime now);
}
