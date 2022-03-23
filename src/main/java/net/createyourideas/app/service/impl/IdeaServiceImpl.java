package net.createyourideas.app.service.impl;

import java.util.Optional;
import net.createyourideas.app.domain.Idea;
import net.createyourideas.app.repository.IdeaRepository;
import net.createyourideas.app.service.IdeaService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Idea}.
 */
@Service
@Transactional
public class IdeaServiceImpl implements IdeaService {

    private final Logger log = LoggerFactory.getLogger(IdeaServiceImpl.class);

    private final IdeaRepository ideaRepository;

    public IdeaServiceImpl(IdeaRepository ideaRepository) {
        this.ideaRepository = ideaRepository;
    }

    @Override
    public Idea save(Idea idea) {
        log.debug("Request to save Idea : {}", idea);
        return ideaRepository.save(idea);
    }

    @Override
    public Optional<Idea> partialUpdate(Idea idea) {
        log.debug("Request to partially update Idea : {}", idea);

        return ideaRepository
            .findById(idea.getId())
            .map(existingIdea -> {
                if (idea.getTitle() != null) {
                    existingIdea.setTitle(idea.getTitle());
                }
                if (idea.getLogo() != null) {
                    existingIdea.setLogo(idea.getLogo());
                }
                if (idea.getLogoContentType() != null) {
                    existingIdea.setLogoContentType(idea.getLogoContentType());
                }
                if (idea.getDescription() != null) {
                    existingIdea.setDescription(idea.getDescription());
                }
                if (idea.getIdeatype() != null) {
                    existingIdea.setIdeatype(idea.getIdeatype());
                }
                if (idea.getInterest() != null) {
                    existingIdea.setInterest(idea.getInterest());
                }
                if (idea.getDistribution() != null) {
                    existingIdea.setDistribution(idea.getDistribution());
                }
                if (idea.getInvestment() != null) {
                    existingIdea.setInvestment(idea.getInvestment());
                }
                if (idea.getActive() != null) {
                    existingIdea.setActive(idea.getActive());
                }
                if (idea.getDate() != null) {
                    existingIdea.setDate(idea.getDate());
                }

                return existingIdea;
            })
            .map(ideaRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Idea> findAll(Pageable pageable) {
        log.debug("Request to get all Ideas");
        return ideaRepository.findAll(pageable);
    }

    public Page<Idea> findAllWithEagerRelationships(Pageable pageable) {
        return ideaRepository.findAllWithEagerRelationships(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Idea> findOne(Long id) {
        log.debug("Request to get Idea : {}", id);
        return ideaRepository.findOneWithEagerRelationships(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Idea : {}", id);
        ideaRepository.deleteById(id);
    }
}
