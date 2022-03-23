package net.createyourideas.app.service.impl;

import java.util.List;
import java.util.Optional;
import net.createyourideas.app.domain.IdeaLikeDislike;
import net.createyourideas.app.repository.IdeaLikeDislikeRepository;
import net.createyourideas.app.service.IdeaLikeDislikeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link IdeaLikeDislike}.
 */
@Service
@Transactional
public class IdeaLikeDislikeServiceImpl implements IdeaLikeDislikeService {

    private final Logger log = LoggerFactory.getLogger(IdeaLikeDislikeServiceImpl.class);

    private final IdeaLikeDislikeRepository ideaLikeDislikeRepository;

    public IdeaLikeDislikeServiceImpl(IdeaLikeDislikeRepository ideaLikeDislikeRepository) {
        this.ideaLikeDislikeRepository = ideaLikeDislikeRepository;
    }

    @Override
    public IdeaLikeDislike save(IdeaLikeDislike ideaLikeDislike) {
        log.debug("Request to save IdeaLikeDislike : {}", ideaLikeDislike);
        return ideaLikeDislikeRepository.save(ideaLikeDislike);
    }

    @Override
    public Optional<IdeaLikeDislike> partialUpdate(IdeaLikeDislike ideaLikeDislike) {
        log.debug("Request to partially update IdeaLikeDislike : {}", ideaLikeDislike);

        return ideaLikeDislikeRepository
            .findById(ideaLikeDislike.getId())
            .map(existingIdeaLikeDislike -> {
                if (ideaLikeDislike.getLike() != null) {
                    existingIdeaLikeDislike.setLike(ideaLikeDislike.getLike());
                }
                if (ideaLikeDislike.getDislike() != null) {
                    existingIdeaLikeDislike.setDislike(ideaLikeDislike.getDislike());
                }
                if (ideaLikeDislike.getDate() != null) {
                    existingIdeaLikeDislike.setDate(ideaLikeDislike.getDate());
                }
                if (ideaLikeDislike.getComment() != null) {
                    existingIdeaLikeDislike.setComment(ideaLikeDislike.getComment());
                }

                return existingIdeaLikeDislike;
            })
            .map(ideaLikeDislikeRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<IdeaLikeDislike> findAll() {
        log.debug("Request to get all IdeaLikeDislikes");
        return ideaLikeDislikeRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<IdeaLikeDislike> findOne(Long id) {
        log.debug("Request to get IdeaLikeDislike : {}", id);
        return ideaLikeDislikeRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete IdeaLikeDislike : {}", id);
        ideaLikeDislikeRepository.deleteById(id);
    }
}
