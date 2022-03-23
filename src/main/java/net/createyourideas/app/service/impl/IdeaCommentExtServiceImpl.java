package net.createyourideas.app.service.impl;

import java.util.List;
import java.util.Optional;
import net.createyourideas.app.domain.IdeaComment;
import net.createyourideas.app.repository.IdeaCommentExtRepository;
import net.createyourideas.app.repository.IdeaCommentRepository;
import net.createyourideas.app.service.IdeaCommentExtService;
import net.createyourideas.app.service.IdeaCommentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link IdeaComment}.
 */
@Service
@Transactional
public class IdeaCommentExtServiceImpl implements IdeaCommentExtService {

    private final Logger log = LoggerFactory.getLogger(IdeaCommentExtServiceImpl.class);

    private final IdeaCommentExtRepository ideaCommentExtRepository;

    public IdeaCommentExtServiceImpl(IdeaCommentExtRepository ideaCommentExtRepository) {
        this.ideaCommentExtRepository = ideaCommentExtRepository;
    }

    @Override
    public List<IdeaComment> findAllByIdeaId(Long ideaId) {
        return ideaCommentExtRepository.findAllByIdeaId(ideaId);
    }

}
