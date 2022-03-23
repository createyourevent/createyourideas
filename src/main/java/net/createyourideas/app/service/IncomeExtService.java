package net.createyourideas.app.service;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import net.createyourideas.app.domain.Income;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Income}.
 */
public interface IncomeExtService {
    List<Income> findAllByIdeaId(Long ideaId);
    List<Income> findAllIncomeByIdeaIdAndDate(Long id, ZonedDateTime now);
}
