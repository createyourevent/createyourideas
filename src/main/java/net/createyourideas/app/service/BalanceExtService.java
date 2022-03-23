package net.createyourideas.app.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import net.createyourideas.app.domain.Balance;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Balance}.
 */
public interface BalanceExtService {
    Balance findOneByIdeaIdAndDate(Long ideaId, LocalDate date);
    List<Balance> findAll();
    List<Balance> findAllByIdeaId(Long ideaId);
}
