package net.createyourideas.app.repository;

import java.util.List;
import net.createyourideas.app.domain.IdeaComment;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the IdeaComment entity.
 */
@SuppressWarnings("unused")
@Repository
public interface IdeaCommentExtRepository extends JpaRepository<IdeaComment, Long> {

    List<IdeaComment> findAllByIdeaId(Long ideaId);

}
