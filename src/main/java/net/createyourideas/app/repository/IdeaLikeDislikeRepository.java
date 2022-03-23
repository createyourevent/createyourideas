package net.createyourideas.app.repository;

import java.util.List;
import net.createyourideas.app.domain.IdeaLikeDislike;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the IdeaLikeDislike entity.
 */
@SuppressWarnings("unused")
@Repository
public interface IdeaLikeDislikeRepository extends JpaRepository<IdeaLikeDislike, Long> {
    @Query("select ideaLikeDislike from IdeaLikeDislike ideaLikeDislike where ideaLikeDislike.user.login = ?#{principal.preferredUsername}")
    List<IdeaLikeDislike> findByUserIsCurrentUser();
}
