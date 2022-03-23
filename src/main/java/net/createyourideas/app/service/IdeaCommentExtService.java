package net.createyourideas.app.service;

import java.util.List;
import java.util.Optional;
import net.createyourideas.app.domain.IdeaComment;

/**
 * Service Interface for managing {@link IdeaComment}.
 */
public interface IdeaCommentExtService {

    List<IdeaComment> findAllByIdeaId(Long ideaId);
}
