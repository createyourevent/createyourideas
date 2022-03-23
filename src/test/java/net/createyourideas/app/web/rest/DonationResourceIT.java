package net.createyourideas.app.web.rest;

import static net.createyourideas.app.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import net.createyourideas.app.IntegrationTest;
import net.createyourideas.app.domain.Donation;
import net.createyourideas.app.repository.DonationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link DonationResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DonationResourceIT {

    private static final Float DEFAULT_AMOUNT = 1F;
    private static final Float UPDATED_AMOUNT = 2F;

    private static final ZonedDateTime DEFAULT_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final Boolean DEFAULT_BILLED = false;
    private static final Boolean UPDATED_BILLED = true;

    private static final String ENTITY_API_URL = "/api/donations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private DonationRepository donationRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDonationMockMvc;

    private Donation donation;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Donation createEntity(EntityManager em) {
        Donation donation = new Donation().amount(DEFAULT_AMOUNT).date(DEFAULT_DATE).billed(DEFAULT_BILLED);
        return donation;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Donation createUpdatedEntity(EntityManager em) {
        Donation donation = new Donation().amount(UPDATED_AMOUNT).date(UPDATED_DATE).billed(UPDATED_BILLED);
        return donation;
    }

    @BeforeEach
    public void initTest() {
        donation = createEntity(em);
    }

    @Test
    @Transactional
    void createDonation() throws Exception {
        int databaseSizeBeforeCreate = donationRepository.findAll().size();
        // Create the Donation
        restDonationMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(donation))
            )
            .andExpect(status().isCreated());

        // Validate the Donation in the database
        List<Donation> donationList = donationRepository.findAll();
        assertThat(donationList).hasSize(databaseSizeBeforeCreate + 1);
        Donation testDonation = donationList.get(donationList.size() - 1);
        assertThat(testDonation.getAmount()).isEqualTo(DEFAULT_AMOUNT);
        assertThat(testDonation.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testDonation.getBilled()).isEqualTo(DEFAULT_BILLED);
    }

    @Test
    @Transactional
    void createDonationWithExistingId() throws Exception {
        // Create the Donation with an existing ID
        donation.setId(1L);

        int databaseSizeBeforeCreate = donationRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDonationMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(donation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Donation in the database
        List<Donation> donationList = donationRepository.findAll();
        assertThat(donationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllDonations() throws Exception {
        // Initialize the database
        donationRepository.saveAndFlush(donation);

        // Get all the donationList
        restDonationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(donation.getId().intValue())))
            .andExpect(jsonPath("$.[*].amount").value(hasItem(DEFAULT_AMOUNT.doubleValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(sameInstant(DEFAULT_DATE))))
            .andExpect(jsonPath("$.[*].billed").value(hasItem(DEFAULT_BILLED.booleanValue())));
    }

    @Test
    @Transactional
    void getDonation() throws Exception {
        // Initialize the database
        donationRepository.saveAndFlush(donation);

        // Get the donation
        restDonationMockMvc
            .perform(get(ENTITY_API_URL_ID, donation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(donation.getId().intValue()))
            .andExpect(jsonPath("$.amount").value(DEFAULT_AMOUNT.doubleValue()))
            .andExpect(jsonPath("$.date").value(sameInstant(DEFAULT_DATE)))
            .andExpect(jsonPath("$.billed").value(DEFAULT_BILLED.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingDonation() throws Exception {
        // Get the donation
        restDonationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewDonation() throws Exception {
        // Initialize the database
        donationRepository.saveAndFlush(donation);

        int databaseSizeBeforeUpdate = donationRepository.findAll().size();

        // Update the donation
        Donation updatedDonation = donationRepository.findById(donation.getId()).get();
        // Disconnect from session so that the updates on updatedDonation are not directly saved in db
        em.detach(updatedDonation);
        updatedDonation.amount(UPDATED_AMOUNT).date(UPDATED_DATE).billed(UPDATED_BILLED);

        restDonationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDonation.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedDonation))
            )
            .andExpect(status().isOk());

        // Validate the Donation in the database
        List<Donation> donationList = donationRepository.findAll();
        assertThat(donationList).hasSize(databaseSizeBeforeUpdate);
        Donation testDonation = donationList.get(donationList.size() - 1);
        assertThat(testDonation.getAmount()).isEqualTo(UPDATED_AMOUNT);
        assertThat(testDonation.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testDonation.getBilled()).isEqualTo(UPDATED_BILLED);
    }

    @Test
    @Transactional
    void putNonExistingDonation() throws Exception {
        int databaseSizeBeforeUpdate = donationRepository.findAll().size();
        donation.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDonationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, donation.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(donation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Donation in the database
        List<Donation> donationList = donationRepository.findAll();
        assertThat(donationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDonation() throws Exception {
        int databaseSizeBeforeUpdate = donationRepository.findAll().size();
        donation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDonationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(donation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Donation in the database
        List<Donation> donationList = donationRepository.findAll();
        assertThat(donationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDonation() throws Exception {
        int databaseSizeBeforeUpdate = donationRepository.findAll().size();
        donation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDonationMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(donation))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Donation in the database
        List<Donation> donationList = donationRepository.findAll();
        assertThat(donationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDonationWithPatch() throws Exception {
        // Initialize the database
        donationRepository.saveAndFlush(donation);

        int databaseSizeBeforeUpdate = donationRepository.findAll().size();

        // Update the donation using partial update
        Donation partialUpdatedDonation = new Donation();
        partialUpdatedDonation.setId(donation.getId());

        partialUpdatedDonation.amount(UPDATED_AMOUNT).billed(UPDATED_BILLED);

        restDonationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDonation.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDonation))
            )
            .andExpect(status().isOk());

        // Validate the Donation in the database
        List<Donation> donationList = donationRepository.findAll();
        assertThat(donationList).hasSize(databaseSizeBeforeUpdate);
        Donation testDonation = donationList.get(donationList.size() - 1);
        assertThat(testDonation.getAmount()).isEqualTo(UPDATED_AMOUNT);
        assertThat(testDonation.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testDonation.getBilled()).isEqualTo(UPDATED_BILLED);
    }

    @Test
    @Transactional
    void fullUpdateDonationWithPatch() throws Exception {
        // Initialize the database
        donationRepository.saveAndFlush(donation);

        int databaseSizeBeforeUpdate = donationRepository.findAll().size();

        // Update the donation using partial update
        Donation partialUpdatedDonation = new Donation();
        partialUpdatedDonation.setId(donation.getId());

        partialUpdatedDonation.amount(UPDATED_AMOUNT).date(UPDATED_DATE).billed(UPDATED_BILLED);

        restDonationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDonation.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDonation))
            )
            .andExpect(status().isOk());

        // Validate the Donation in the database
        List<Donation> donationList = donationRepository.findAll();
        assertThat(donationList).hasSize(databaseSizeBeforeUpdate);
        Donation testDonation = donationList.get(donationList.size() - 1);
        assertThat(testDonation.getAmount()).isEqualTo(UPDATED_AMOUNT);
        assertThat(testDonation.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testDonation.getBilled()).isEqualTo(UPDATED_BILLED);
    }

    @Test
    @Transactional
    void patchNonExistingDonation() throws Exception {
        int databaseSizeBeforeUpdate = donationRepository.findAll().size();
        donation.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDonationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, donation.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(donation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Donation in the database
        List<Donation> donationList = donationRepository.findAll();
        assertThat(donationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDonation() throws Exception {
        int databaseSizeBeforeUpdate = donationRepository.findAll().size();
        donation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDonationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(donation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Donation in the database
        List<Donation> donationList = donationRepository.findAll();
        assertThat(donationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDonation() throws Exception {
        int databaseSizeBeforeUpdate = donationRepository.findAll().size();
        donation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDonationMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(donation))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Donation in the database
        List<Donation> donationList = donationRepository.findAll();
        assertThat(donationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDonation() throws Exception {
        // Initialize the database
        donationRepository.saveAndFlush(donation);

        int databaseSizeBeforeDelete = donationRepository.findAll().size();

        // Delete the donation
        restDonationMockMvc
            .perform(delete(ENTITY_API_URL_ID, donation.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Donation> donationList = donationRepository.findAll();
        assertThat(donationList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
