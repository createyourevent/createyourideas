package net.createyourideas.app.repository;

import java.util.List;
import java.util.Optional;
import net.createyourideas.app.domain.Outgoings;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Outgoings entity.
 */
@Repository
public interface OutgoingsRepository extends JpaRepository<Outgoings, Long> {
    @Query(
        value = "select distinct outgoings from Outgoings outgoings left join fetch outgoings.outgoingIdeas",
        countQuery = "select count(distinct outgoings) from Outgoings outgoings"
    )
    Page<Outgoings> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct outgoings from Outgoings outgoings left join fetch outgoings.outgoingIdeas")
    List<Outgoings> findAllWithEagerRelationships();

    @Query("select outgoings from Outgoings outgoings left join fetch outgoings.outgoingIdeas where outgoings.id =:id")
    Optional<Outgoings> findOneWithEagerRelationships(@Param("id") Long id);
}
