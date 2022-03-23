package net.createyourideas.app.service;

import java.util.List;

import net.createyourideas.app.domain.IdeaLikeDislike;


/**
 * Service Interface for managing {@link IdeaLikeDislike}.
 */
public interface IdeaLikeDislikeExtensionService {

    List<IdeaLikeDislike> findAllByIdeaId(Long ideaId);
    List<IdeaLikeDislike> findAllByIdeaIdAndUserId(Long ideaId, String userId);
}
