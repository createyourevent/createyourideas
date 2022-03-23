package net.createyourideas.app.service.impl;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import net.createyourideas.app.domain.IdeaLikeDislike;
import net.createyourideas.app.repository.IdeaLikeDislikeExtensionRepository;
import net.createyourideas.app.service.IdeaLikeDislikeExtensionService;

import java.util.List;

/**
 * Service Implementation for managing {@link IdeaLikeDislike}.
 */
@Service
@Transactional
public class IdeaLikeDislikeExtensionServiceImpl implements IdeaLikeDislikeExtensionService {

    private final Logger log = LoggerFactory.getLogger(IdeaLikeDislikeExtensionServiceImpl.class);

    private final IdeaLikeDislikeExtensionRepository ideaLikeDislikeExtensionRepository;

    public IdeaLikeDislikeExtensionServiceImpl(IdeaLikeDislikeExtensionRepository ideaLikeDislikeExtensionRepository) {
        this.ideaLikeDislikeExtensionRepository = ideaLikeDislikeExtensionRepository;
    }

    @Override
    public List<IdeaLikeDislike> findAllByIdeaId(Long ideaId) {
        return ideaLikeDislikeExtensionRepository.findAllByIdeaId(ideaId);
    }

    @Override
    public List<IdeaLikeDislike> findAllByIdeaIdAndUserId(Long ideaId, String userId) {
        return ideaLikeDislikeExtensionRepository.findAllByIdeaIdAndUserId(ideaId, userId);
    }

}
