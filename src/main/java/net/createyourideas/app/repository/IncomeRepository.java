package net.createyourideas.app.repository;

import java.util.List;
import java.util.Optional;
import net.createyourideas.app.domain.Income;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Income entity.
 */
@Repository
public interface IncomeRepository extends JpaRepository<Income, Long> {
    @Query(
        value = "select distinct income from Income income left join fetch income.incomeIdeas",
        countQuery = "select count(distinct income) from Income income"
    )
    Page<Income> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct income from Income income left join fetch income.incomeIdeas")
    List<Income> findAllWithEagerRelationships();

    @Query("select income from Income income left join fetch income.incomeIdeas where income.id =:id")
    Optional<Income> findOneWithEagerRelationships(@Param("id") Long id);
}
