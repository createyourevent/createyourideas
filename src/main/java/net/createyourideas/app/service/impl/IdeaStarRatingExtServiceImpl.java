package net.createyourideas.app.service.impl;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import net.createyourideas.app.domain.IdeaStarRating;
import net.createyourideas.app.repository.IdeaStarRatingExtRepository;
import net.createyourideas.app.service.IdeaStarRatingExtService;

import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing {@link IdeaStarRating}.
 */
@Service
@Transactional
public class IdeaStarRatingExtServiceImpl implements IdeaStarRatingExtService {

    private final Logger log = LoggerFactory.getLogger(IdeaStarRatingExtServiceImpl.class);

    private final IdeaStarRatingExtRepository ideaStarRatingExtRepository;

    public IdeaStarRatingExtServiceImpl(IdeaStarRatingExtRepository ideaStarRatingExtRepository) {
        this.ideaStarRatingExtRepository = ideaStarRatingExtRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<IdeaStarRating> findIdeaStarRatingsByIdeaId(Long ideaId) {
        log.debug("findByIdeaId all IdeaStarRatings");
        return ideaStarRatingExtRepository.findByIdeaId(ideaId);
    }

    @Override
    public IdeaStarRating findByIdeaIdAndUserId(Long ideaId, String userId) {
        log.debug("findByIdeaIdAndUserId all IdeaStarRatings");
        return ideaStarRatingExtRepository.findByIdeaIdAndUserId(ideaId, userId);
    }
}


