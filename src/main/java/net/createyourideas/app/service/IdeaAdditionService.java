package net.createyourideas.app.service;

import net.createyourideas.app.domain.Idea;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Idea}.
 */
public interface IdeaAdditionService {

    Page<Idea> findByUserIsCurrentUser(Pageable pageable);

    Page<Idea> findAllById(Long id, Pageable pageable);

    void loadNodes();
}
