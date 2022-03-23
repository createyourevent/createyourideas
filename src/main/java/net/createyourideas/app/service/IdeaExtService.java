package net.createyourideas.app.service;

import java.util.List;
import net.createyourideas.app.domain.Idea;

/**
 * Service Interface for managing {@link Idea}.
 */
public interface IdeaExtService {
    List<Idea> findAll();
    List<Idea> findAllByActiveTrue();
    List<Idea> findAllByActiveFalse();
    List<Idea> findByUserIsCurrentUser();
    Idea findOneById(Long id);
    Idea findAllByActiveTrueEagerDonations(Long id);
    Idea findAllByActiveTrueEagerEmployees(Long id);
    Idea findAllByActiveTrueEagerEmployeesAndApplication(Long id);
    Idea findOneByActiveTrueAndId(Long id);
}
