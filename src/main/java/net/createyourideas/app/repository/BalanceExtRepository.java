package net.createyourideas.app.repository;

import java.time.LocalDate;
import java.util.List;

import net.createyourideas.app.domain.Balance;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Balance entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BalanceExtRepository extends JpaRepository<Balance, Long> {
    Balance findOneByIdeaIdAndDate(Long ideaId, LocalDate date);
    List<Balance> findAllByIdeaId(Long ideaId);
    List<Balance> findAll();
}
