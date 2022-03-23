package net.createyourideas.app.service.impl;

import java.util.List;
import java.util.Optional;
import net.createyourideas.app.domain.Donation;
import net.createyourideas.app.repository.DonationRepository;
import net.createyourideas.app.service.DonationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Donation}.
 */
@Service
@Transactional
public class DonationServiceImpl implements DonationService {

    private final Logger log = LoggerFactory.getLogger(DonationServiceImpl.class);

    private final DonationRepository donationRepository;

    public DonationServiceImpl(DonationRepository donationRepository) {
        this.donationRepository = donationRepository;
    }

    @Override
    public Donation save(Donation donation) {
        log.debug("Request to save Donation : {}", donation);
        return donationRepository.save(donation);
    }

    @Override
    public Optional<Donation> partialUpdate(Donation donation) {
        log.debug("Request to partially update Donation : {}", donation);

        return donationRepository
            .findById(donation.getId())
            .map(existingDonation -> {
                if (donation.getAmount() != null) {
                    existingDonation.setAmount(donation.getAmount());
                }
                if (donation.getDate() != null) {
                    existingDonation.setDate(donation.getDate());
                }
                if (donation.getBilled() != null) {
                    existingDonation.setBilled(donation.getBilled());
                }

                return existingDonation;
            })
            .map(donationRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Donation> findAll() {
        log.debug("Request to get all Donations");
        return donationRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Donation> findOne(Long id) {
        log.debug("Request to get Donation : {}", id);
        return donationRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Donation : {}", id);
        donationRepository.deleteById(id);
    }
}
