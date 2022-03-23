package net.createyourideas.app.service.impl;

import java.util.List;
import java.util.Optional;
import net.createyourideas.app.domain.IdeaComment;
import net.createyourideas.app.repository.IdeaCommentRepository;
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
public class IdeaCommentServiceImpl implements IdeaCommentService {

    private final Logger log = LoggerFactory.getLogger(IdeaCommentServiceImpl.class);

    private final IdeaCommentRepository ideaCommentRepository;

    public IdeaCommentServiceImpl(IdeaCommentRepository ideaCommentRepository) {
        this.ideaCommentRepository = ideaCommentRepository;
    }

    @Override
    public IdeaComment save(IdeaComment ideaComment) {
        log.debug("Request to save IdeaComment : {}", ideaComment);
        return ideaCommentRepository.save(ideaComment);
    }

    @Override
    public Optional<IdeaComment> partialUpdate(IdeaComment ideaComment) {
        log.debug("Request to partially update IdeaComment : {}", ideaComment);

        return ideaCommentRepository
            .findById(ideaComment.getId())
            .map(existingIdeaComment -> {
                if (ideaComment.getComment() != null) {
                    existingIdeaComment.setComment(ideaComment.getComment());
                }
                if (ideaComment.getDate() != null) {
                    existingIdeaComment.setDate(ideaComment.getDate());
                }

                return existingIdeaComment;
            })
            .map(ideaCommentRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<IdeaComment> findAll() {
        log.debug("Request to get all IdeaComments");
        return ideaCommentRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<IdeaComment> findOne(Long id) {
        log.debug("Request to get IdeaComment : {}", id);
        return ideaCommentRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete IdeaComment : {}", id);
        ideaCommentRepository.deleteById(id);
    }
}
