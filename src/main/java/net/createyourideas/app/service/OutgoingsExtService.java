package net.createyourideas.app.service;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import net.createyourideas.app.domain.Outgoings;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Outgoings}.
 */
public interface OutgoingsExtService {
    List<Outgoings> findAllByIdeaId(Long ideaId);
    List<Outgoings> findAllOutgoingByIdeaIdAndDate(Long id, ZonedDateTime now);
}
