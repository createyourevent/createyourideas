package net.createyourideas.app.service.impl;

import java.util.List;
import java.util.Optional;
import net.createyourideas.app.domain.UserPointAssociation;
import net.createyourideas.app.repository.UserPointAssociationRepository;
import net.createyourideas.app.service.UserPointAssociationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link UserPointAssociation}.
 */
@Service
@Transactional
public class UserPointAssociationServiceImpl implements UserPointAssociationService {

    private final Logger log = LoggerFactory.getLogger(UserPointAssociationServiceImpl.class);

    private final UserPointAssociationRepository userPointAssociationRepository;

    public UserPointAssociationServiceImpl(UserPointAssociationRepository userPointAssociationRepository) {
        this.userPointAssociationRepository = userPointAssociationRepository;
    }

    @Override
    public UserPointAssociation save(UserPointAssociation userPointAssociation) {
        log.debug("Request to save UserPointAssociation : {}", userPointAssociation);
        return userPointAssociationRepository.save(userPointAssociation);
    }

    @Override
    public Optional<UserPointAssociation> partialUpdate(UserPointAssociation userPointAssociation) {
        log.debug("Request to partially update UserPointAssociation : {}", userPointAssociation);

        return userPointAssociationRepository
            .findById(userPointAssociation.getId())
            .map(existingUserPointAssociation -> {
                if (userPointAssociation.getDate() != null) {
                    existingUserPointAssociation.setDate(userPointAssociation.getDate());
                }

                return existingUserPointAssociation;
            })
            .map(userPointAssociationRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserPointAssociation> findAll() {
        log.debug("Request to get all UserPointAssociations");
        return userPointAssociationRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<UserPointAssociation> findOne(Long id) {
        log.debug("Request to get UserPointAssociation : {}", id);
        return userPointAssociationRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete UserPointAssociation : {}", id);
        userPointAssociationRepository.deleteById(id);
    }
}
