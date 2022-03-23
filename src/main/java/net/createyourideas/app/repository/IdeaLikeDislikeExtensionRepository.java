package net.createyourideas.app.repository;

import java.util.List;


import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import net.createyourideas.app.domain.IdeaLikeDislike;

/**
 * Spring Data  repository for the ShopLikeDislike entity.
 */
@SuppressWarnings("unused")
@Repository
public interface IdeaLikeDislikeExtensionRepository extends JpaRepository<IdeaLikeDislike, Long> {

    List<IdeaLikeDislike> findAllByIdeaId(Long ideaId);
    List<IdeaLikeDislike> findAllByIdeaIdAndUserId(Long ideaId, String userId);
}
