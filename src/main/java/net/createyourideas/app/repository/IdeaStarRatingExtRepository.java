package net.createyourideas.app.repository;



import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import net.createyourideas.app.domain.IdeaStarRating;

import java.util.List;

/**
 * Spring Data  repository for the ShopStarRating entity.
 */
@SuppressWarnings("unused")
@Repository
public interface IdeaStarRatingExtRepository extends JpaRepository<IdeaStarRating, Long> {

    List<IdeaStarRating> findByIdeaId(Long ideaId);

    IdeaStarRating findByIdeaIdAndUserId(Long ideaId, String userId);

}
