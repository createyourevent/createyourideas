package net.createyourideas.app.repository;

import java.time.ZonedDateTime;
import java.util.List;

import net.createyourideas.app.domain.Income;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Income entity.
 */
@SuppressWarnings("unused")
@Repository
public interface IncomeExtRepository extends JpaRepository<Income, Long> {

    List<Income> findAllByIdeaId(Long ideaId);

    @Query("select income from Income income where income.idea.id = :id and DATE(income.date) = DATE(:now)")
    List<Income> findAllIncomeByIdeaIdAndDate(@Param("id") Long id, @Param("now") ZonedDateTime now);

}
