package net.createyourideas.app.repository;

import java.time.ZonedDateTime;
import java.util.List;
import net.createyourideas.app.domain.Worksheet;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Worksheet entity.
 */
@SuppressWarnings("unused")
@Repository
public interface WorksheetExtRepository extends JpaRepository<Worksheet, Long> {

    List<Worksheet> findAllByIdeaId(Long ideaId);

    @Query("select w from Worksheet w where w.idea.id = :id and DATE(w.dateStart) = DATE(:now)")
    List<Worksheet> findAllWorksheetByIdeaIdAndDate(@Param("id") Long id, @Param("now") ZonedDateTime now);

}
