package net.createyourideas.app.service.impl;

import java.util.List;
import java.util.Optional;
import net.createyourideas.app.domain.Feedback;
import net.createyourideas.app.repository.FeedbackRepository;
import net.createyourideas.app.service.FeedbackService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Feedback}.
 */
@Service
@Transactional
public class FeedbackServiceImpl implements FeedbackService {

    private final Logger log = LoggerFactory.getLogger(FeedbackServiceImpl.class);

    private final FeedbackRepository feedbackRepository;

    public FeedbackServiceImpl(FeedbackRepository feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }

    @Override
    public Feedback save(Feedback feedback) {
        log.debug("Request to save Feedback : {}", feedback);
        return feedbackRepository.save(feedback);
    }

    @Override
    public Optional<Feedback> partialUpdate(Feedback feedback) {
        log.debug("Request to partially update Feedback : {}", feedback);

        return feedbackRepository
            .findById(feedback.getId())
            .map(existingFeedback -> {
                if (feedback.getCreationDate() != null) {
                    existingFeedback.setCreationDate(feedback.getCreationDate());
                }
                if (feedback.getName() != null) {
                    existingFeedback.setName(feedback.getName());
                }
                if (feedback.getEmail() != null) {
                    existingFeedback.setEmail(feedback.getEmail());
                }
                if (feedback.getFeedback() != null) {
                    existingFeedback.setFeedback(feedback.getFeedback());
                }

                return existingFeedback;
            })
            .map(feedbackRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Feedback> findAll() {
        log.debug("Request to get all Feedbacks");
        return feedbackRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Feedback> findOne(Long id) {
        log.debug("Request to get Feedback : {}", id);
        return feedbackRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Feedback : {}", id);
        feedbackRepository.deleteById(id);
    }
}
