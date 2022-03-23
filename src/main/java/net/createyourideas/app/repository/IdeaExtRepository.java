package net.createyourideas.app.repository;

import java.util.List;
import net.createyourideas.app.domain.Idea;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import io.swagger.v3.oas.annotations.Parameter;

/**
 * Spring Data SQL repository for the Idea entity.
 */
@SuppressWarnings("unused")
@Repository
public interface IdeaExtRepository extends JpaRepository<Idea, Long> {
    @Query("select idea from Idea idea where idea.user.login = ?#{principal.preferredUsername}")
    List<Idea> findByUserIsCurrentUser();

    @Query("select idea from Idea idea where idea.user.login = ?#{principal.preferredUsername}")
    Page<Idea> findByUserIsCurrentUser(Pageable pageable);

    Page<Idea> findAllById(Long id, Pageable pageable);

    @Query("select distinct idea from Idea idea left join fetch idea.incomes i left join fetch idea.outgoings o left join fetch idea.worksheets w where idea.id = :id")
    Idea findOneById(@Param("id") Long id);

    List<Idea> findAllByActiveTrue();

    List<Idea> findAllByActiveFalse();

    List<Idea> findAll();

    @Query("select distinct idea from Idea idea left join fetch idea.monthlyIncomeInvoices mii left join fetch idea.monthlyOutgoingsInvoices moi left join fetch idea.donations d left join fetch idea.incomes i left join fetch idea.balances b left join fetch idea.outgoings o left join fetch idea.worksheets w where idea.active = true")
    List<Idea> findAllByActiveTrueEager();

    @Query("select distinct idea from Idea idea left join fetch idea.donations d left join fetch idea.incomes i left join fetch idea.balances b left join fetch idea.outgoings o where idea.active = true")
    List<Idea> findAllByActiveTrueEagerBalancesIncomeOutcomeDonations();

    @Query("select distinct idea from Idea idea left join fetch idea.donations where idea.active = true and idea.id = :id")
    Idea findAllByActiveTrueEagerDonations(@Param("id") Long id);

    @Query("select distinct idea from Idea idea left join fetch idea.employees where idea.active = true and idea.id = :id")
    Idea findAllByActiveTrueEagerEmployees(@Param("id") Long id);

    @Query("select distinct idea from Idea idea left join fetch idea.employees left join fetch idea.user left join fetch idea.applications where idea.active = true and idea.id = :id")
    Idea findAllByActiveTrueEagerEmployeesAndApplication(@Param("id") Long id);

    @Query("select distinct idea from Idea idea left join fetch idea.incomes i left join fetch idea.balances ba left join fetch idea.outgoings o left join fetch idea.donations d left join fetch idea.worksheets w left join fetch idea.employees e left join fetch idea.applications a left join fetch idea.ideaComments ic where idea.active = true and idea.id = :id")
    Idea findOneByActiveTrueAndId(@Param("id") Long id);
}
