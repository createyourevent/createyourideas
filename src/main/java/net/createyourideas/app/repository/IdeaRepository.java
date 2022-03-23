package net.createyourideas.app.repository;

import java.util.List;
import java.util.Optional;
import net.createyourideas.app.domain.Idea;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Idea entity.
 */
@Repository
public interface IdeaRepository extends JpaRepository<Idea, Long> {
    @Query("select idea from Idea idea where idea.user.login = ?#{principal.preferredUsername}")
    List<Idea> findByUserIsCurrentUser();

    @Query(
        value = "select distinct idea from Idea idea left join fetch idea.employees",
        countQuery = "select count(distinct idea) from Idea idea"
    )
    Page<Idea> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct idea from Idea idea left join fetch idea.employees")
    List<Idea> findAllWithEagerRelationships();

    @Query("select idea from Idea idea left join fetch idea.employees where idea.id =:id")
    Optional<Idea> findOneWithEagerRelationships(@Param("id") Long id);
}
