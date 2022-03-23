package net.createyourideas.app.repository;

import java.time.ZonedDateTime;
import java.util.List;

import net.createyourideas.app.domain.Outgoings;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Outgoings entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OutgoingsExtRepository extends JpaRepository<Outgoings, Long> {
    List<Outgoings> findAllByIdeaId(Long ideaId);

    @Query("select o from Outgoings o where o.idea.id = :id and DATE(o.date) = DATE(:now)")
    List<Outgoings> findAllOutgoingByIdeaIdAndDate(@Param("id") Long id, @Param("now") ZonedDateTime now);
}
