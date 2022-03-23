package net.createyourideas.app.service;

import java.util.List;
import java.util.Optional;
import net.createyourideas.app.domain.UserPointAssociation;

/**
 * Service Interface for managing {@link UserPointAssociation}.
 */
public interface UserPointAssociationService {
    /**
     * Save a userPointAssociation.
     *
     * @param userPointAssociation the entity to save.
     * @return the persisted entity.
     */
    UserPointAssociation save(UserPointAssociation userPointAssociation);

    /**
     * Partially updates a userPointAssociation.
     *
     * @param userPointAssociation the entity to update partially.
     * @return the persisted entity.
     */
    Optional<UserPointAssociation> partialUpdate(UserPointAssociation userPointAssociation);

    /**
     * Get all the userPointAssociations.
     *
     * @return the list of entities.
     */
    List<UserPointAssociation> findAll();

    /**
     * Get the "id" userPointAssociation.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<UserPointAssociation> findOne(Long id);

    /**
     * Delete the "id" userPointAssociation.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
