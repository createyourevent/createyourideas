package net.createyourideas.app.service;

import java.util.List;
import java.util.Optional;
import net.createyourideas.app.domain.Donation;

/**
 * Service Interface for managing {@link Donation}.
 */
public interface DonationService {
    /**
     * Save a donation.
     *
     * @param donation the entity to save.
     * @return the persisted entity.
     */
    Donation save(Donation donation);

    /**
     * Partially updates a donation.
     *
     * @param donation the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Donation> partialUpdate(Donation donation);

    /**
     * Get all the donations.
     *
     * @return the list of entities.
     */
    List<Donation> findAll();

    /**
     * Get the "id" donation.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Donation> findOne(Long id);

    /**
     * Delete the "id" donation.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
