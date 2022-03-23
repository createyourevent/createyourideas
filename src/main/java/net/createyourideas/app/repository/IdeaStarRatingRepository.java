package net.createyourideas.app.repository;

import java.util.List;
import net.createyourideas.app.domain.IdeaStarRating;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the IdeaStarRating entity.
 */
@SuppressWarnings("unused")
@Repository
public interface IdeaStarRatingRepository extends JpaRepository<IdeaStarRating, Long> {
    @Query("select ideaStarRating from IdeaStarRating ideaStarRating where ideaStarRating.user.login = ?#{principal.preferredUsername}")
    List<IdeaStarRating> findByUserIsCurrentUser();
}
