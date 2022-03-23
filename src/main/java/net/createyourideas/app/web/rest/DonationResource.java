package net.createyourideas.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import net.createyourideas.app.domain.Donation;
import net.createyourideas.app.repository.DonationRepository;
import net.createyourideas.app.service.DonationService;
import net.createyourideas.app.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link net.createyourideas.app.domain.Donation}.
 */
@RestController
@RequestMapping("/api")
public class DonationResource {

    private final Logger log = LoggerFactory.getLogger(DonationResource.class);

    private static final String ENTITY_NAME = "donation";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DonationService donationService;

    private final DonationRepository donationRepository;

    public DonationResource(DonationService donationService, DonationRepository donationRepository) {
        this.donationService = donationService;
        this.donationRepository = donationRepository;
    }

    /**
     * {@code POST  /donations} : Create a new donation.
     *
     * @param donation the donation to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new donation, or with status {@code 400 (Bad Request)} if the donation has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/donations")
    public ResponseEntity<Donation> createDonation(@RequestBody Donation donation) throws URISyntaxException {
        log.debug("REST request to save Donation : {}", donation);
        if (donation.getId() != null) {
            throw new BadRequestAlertException("A new donation cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Donation result = donationService.save(donation);
        return ResponseEntity
            .created(new URI("/api/donations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /donations/:id} : Updates an existing donation.
     *
     * @param id the id of the donation to save.
     * @param donation the donation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated donation,
     * or with status {@code 400 (Bad Request)} if the donation is not valid,
     * or with status {@code 500 (Internal Server Error)} if the donation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/donations/{id}")
    public ResponseEntity<Donation> updateDonation(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Donation donation
    ) throws URISyntaxException {
        log.debug("REST request to update Donation : {}, {}", id, donation);
        if (donation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, donation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!donationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Donation result = donationService.save(donation);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, donation.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /donations/:id} : Partial updates given fields of an existing donation, field will ignore if it is null
     *
     * @param id the id of the donation to save.
     * @param donation the donation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated donation,
     * or with status {@code 400 (Bad Request)} if the donation is not valid,
     * or with status {@code 404 (Not Found)} if the donation is not found,
     * or with status {@code 500 (Internal Server Error)} if the donation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/donations/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Donation> partialUpdateDonation(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Donation donation
    ) throws URISyntaxException {
        log.debug("REST request to partial update Donation partially : {}, {}", id, donation);
        if (donation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, donation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!donationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Donation> result = donationService.partialUpdate(donation);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, donation.getId().toString())
        );
    }

    /**
     * {@code GET  /donations} : get all the donations.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of donations in body.
     */
    @GetMapping("/donations")
    public List<Donation> getAllDonations() {
        log.debug("REST request to get all Donations");
        return donationService.findAll();
    }

    /**
     * {@code GET  /donations/:id} : get the "id" donation.
     *
     * @param id the id of the donation to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the donation, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/donations/{id}")
    public ResponseEntity<Donation> getDonation(@PathVariable Long id) {
        log.debug("REST request to get Donation : {}", id);
        Optional<Donation> donation = donationService.findOne(id);
        return ResponseUtil.wrapOrNotFound(donation);
    }

    /**
     * {@code DELETE  /donations/:id} : delete the "id" donation.
     *
     * @param id the id of the donation to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/donations/{id}")
    public ResponseEntity<Void> deleteDonation(@PathVariable Long id) {
        log.debug("REST request to delete Donation : {}", id);
        donationService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
