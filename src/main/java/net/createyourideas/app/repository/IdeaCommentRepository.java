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
public interface IdeaCommentRepository extends JpaRepository<IdeaComment, Long> {
    @Query("select ideaComment from IdeaComment ideaComment where ideaComment.user.login = ?#{principal.preferredUsername}")
    List<IdeaComment> findByUserIsCurrentUser();
}
