package net.createyourideas.app.service.impl;

import java.util.List;
import java.util.Optional;
import net.createyourideas.app.domain.IdeaStarRating;
import net.createyourideas.app.repository.IdeaStarRatingRepository;
import net.createyourideas.app.service.IdeaStarRatingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link IdeaStarRating}.
 */
@Service
@Transactional
public class IdeaStarRatingServiceImpl implements IdeaStarRatingService {

    private final Logger log = LoggerFactory.getLogger(IdeaStarRatingServiceImpl.class);

    private final IdeaStarRatingRepository ideaStarRatingRepository;

    public IdeaStarRatingServiceImpl(IdeaStarRatingRepository ideaStarRatingRepository) {
        this.ideaStarRatingRepository = ideaStarRatingRepository;
    }

    @Override
    public IdeaStarRating save(IdeaStarRating ideaStarRating) {
        log.debug("Request to save IdeaStarRating : {}", ideaStarRating);
        return ideaStarRatingRepository.save(ideaStarRating);
    }

    @Override
    public Optional<IdeaStarRating> partialUpdate(IdeaStarRating ideaStarRating) {
        log.debug("Request to partially update IdeaStarRating : {}", ideaStarRating);

        return ideaStarRatingRepository
            .findById(ideaStarRating.getId())
            .map(existingIdeaStarRating -> {
                if (ideaStarRating.getStars() != null) {
                    existingIdeaStarRating.setStars(ideaStarRating.getStars());
                }
                if (ideaStarRating.getDate() != null) {
                    existingIdeaStarRating.setDate(ideaStarRating.getDate());
                }
                if (ideaStarRating.getComment() != null) {
                    existingIdeaStarRating.setComment(ideaStarRating.getComment());
                }

                return existingIdeaStarRating;
            })
            .map(ideaStarRatingRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<IdeaStarRating> findAll() {
        log.debug("Request to get all IdeaStarRatings");
        return ideaStarRatingRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<IdeaStarRating> findOne(Long id) {
        log.debug("Request to get IdeaStarRating : {}", id);
        return ideaStarRatingRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete IdeaStarRating : {}", id);
        ideaStarRatingRepository.deleteById(id);
    }
}
