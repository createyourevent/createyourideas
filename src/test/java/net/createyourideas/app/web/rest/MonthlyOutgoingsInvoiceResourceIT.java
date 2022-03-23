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
import net.createyourideas.app.domain.MonthlyOutgoingsInvoice;
import net.createyourideas.app.repository.MonthlyOutgoingsInvoiceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link MonthlyOutgoingsInvoiceResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class MonthlyOutgoingsInvoiceResourceIT {

    private static final Float DEFAULT_TOTAL = 1F;
    private static final Float UPDATED_TOTAL = 2F;

    private static final ZonedDateTime DEFAULT_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/monthly-outgoings-invoices";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MonthlyOutgoingsInvoiceRepository monthlyOutgoingsInvoiceRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMonthlyOutgoingsInvoiceMockMvc;

    private MonthlyOutgoingsInvoice monthlyOutgoingsInvoice;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MonthlyOutgoingsInvoice createEntity(EntityManager em) {
        MonthlyOutgoingsInvoice monthlyOutgoingsInvoice = new MonthlyOutgoingsInvoice().total(DEFAULT_TOTAL).date(DEFAULT_DATE);
        return monthlyOutgoingsInvoice;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MonthlyOutgoingsInvoice createUpdatedEntity(EntityManager em) {
        MonthlyOutgoingsInvoice monthlyOutgoingsInvoice = new MonthlyOutgoingsInvoice().total(UPDATED_TOTAL).date(UPDATED_DATE);
        return monthlyOutgoingsInvoice;
    }

    @BeforeEach
    public void initTest() {
        monthlyOutgoingsInvoice = createEntity(em);
    }

    @Test
    @Transactional
    void createMonthlyOutgoingsInvoice() throws Exception {
        int databaseSizeBeforeCreate = monthlyOutgoingsInvoiceRepository.findAll().size();
        // Create the MonthlyOutgoingsInvoice
        restMonthlyOutgoingsInvoiceMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(monthlyOutgoingsInvoice))
            )
            .andExpect(status().isCreated());

        // Validate the MonthlyOutgoingsInvoice in the database
        List<MonthlyOutgoingsInvoice> monthlyOutgoingsInvoiceList = monthlyOutgoingsInvoiceRepository.findAll();
        assertThat(monthlyOutgoingsInvoiceList).hasSize(databaseSizeBeforeCreate + 1);
        MonthlyOutgoingsInvoice testMonthlyOutgoingsInvoice = monthlyOutgoingsInvoiceList.get(monthlyOutgoingsInvoiceList.size() - 1);
        assertThat(testMonthlyOutgoingsInvoice.getTotal()).isEqualTo(DEFAULT_TOTAL);
        assertThat(testMonthlyOutgoingsInvoice.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    void createMonthlyOutgoingsInvoiceWithExistingId() throws Exception {
        // Create the MonthlyOutgoingsInvoice with an existing ID
        monthlyOutgoingsInvoice.setId(1L);

        int databaseSizeBeforeCreate = monthlyOutgoingsInvoiceRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMonthlyOutgoingsInvoiceMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(monthlyOutgoingsInvoice))
            )
            .andExpect(status().isBadRequest());

        // Validate the MonthlyOutgoingsInvoice in the database
        List<MonthlyOutgoingsInvoice> monthlyOutgoingsInvoiceList = monthlyOutgoingsInvoiceRepository.findAll();
        assertThat(monthlyOutgoingsInvoiceList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllMonthlyOutgoingsInvoices() throws Exception {
        // Initialize the database
        monthlyOutgoingsInvoiceRepository.saveAndFlush(monthlyOutgoingsInvoice);

        // Get all the monthlyOutgoingsInvoiceList
        restMonthlyOutgoingsInvoiceMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(monthlyOutgoingsInvoice.getId().intValue())))
            .andExpect(jsonPath("$.[*].total").value(hasItem(DEFAULT_TOTAL.doubleValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(sameInstant(DEFAULT_DATE))));
    }

    @Test
    @Transactional
    void getMonthlyOutgoingsInvoice() throws Exception {
        // Initialize the database
        monthlyOutgoingsInvoiceRepository.saveAndFlush(monthlyOutgoingsInvoice);

        // Get the monthlyOutgoingsInvoice
        restMonthlyOutgoingsInvoiceMockMvc
            .perform(get(ENTITY_API_URL_ID, monthlyOutgoingsInvoice.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(monthlyOutgoingsInvoice.getId().intValue()))
            .andExpect(jsonPath("$.total").value(DEFAULT_TOTAL.doubleValue()))
            .andExpect(jsonPath("$.date").value(sameInstant(DEFAULT_DATE)));
    }

    @Test
    @Transactional
    void getNonExistingMonthlyOutgoingsInvoice() throws Exception {
        // Get the monthlyOutgoingsInvoice
        restMonthlyOutgoingsInvoiceMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewMonthlyOutgoingsInvoice() throws Exception {
        // Initialize the database
        monthlyOutgoingsInvoiceRepository.saveAndFlush(monthlyOutgoingsInvoice);

        int databaseSizeBeforeUpdate = monthlyOutgoingsInvoiceRepository.findAll().size();

        // Update the monthlyOutgoingsInvoice
        MonthlyOutgoingsInvoice updatedMonthlyOutgoingsInvoice = monthlyOutgoingsInvoiceRepository
            .findById(monthlyOutgoingsInvoice.getId())
            .get();
        // Disconnect from session so that the updates on updatedMonthlyOutgoingsInvoice are not directly saved in db
        em.detach(updatedMonthlyOutgoingsInvoice);
        updatedMonthlyOutgoingsInvoice.total(UPDATED_TOTAL).date(UPDATED_DATE);

        restMonthlyOutgoingsInvoiceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMonthlyOutgoingsInvoice.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMonthlyOutgoingsInvoice))
            )
            .andExpect(status().isOk());

        // Validate the MonthlyOutgoingsInvoice in the database
        List<MonthlyOutgoingsInvoice> monthlyOutgoingsInvoiceList = monthlyOutgoingsInvoiceRepository.findAll();
        assertThat(monthlyOutgoingsInvoiceList).hasSize(databaseSizeBeforeUpdate);
        MonthlyOutgoingsInvoice testMonthlyOutgoingsInvoice = monthlyOutgoingsInvoiceList.get(monthlyOutgoingsInvoiceList.size() - 1);
        assertThat(testMonthlyOutgoingsInvoice.getTotal()).isEqualTo(UPDATED_TOTAL);
        assertThat(testMonthlyOutgoingsInvoice.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void putNonExistingMonthlyOutgoingsInvoice() throws Exception {
        int databaseSizeBeforeUpdate = monthlyOutgoingsInvoiceRepository.findAll().size();
        monthlyOutgoingsInvoice.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMonthlyOutgoingsInvoiceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, monthlyOutgoingsInvoice.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(monthlyOutgoingsInvoice))
            )
            .andExpect(status().isBadRequest());

        // Validate the MonthlyOutgoingsInvoice in the database
        List<MonthlyOutgoingsInvoice> monthlyOutgoingsInvoiceList = monthlyOutgoingsInvoiceRepository.findAll();
        assertThat(monthlyOutgoingsInvoiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMonthlyOutgoingsInvoice() throws Exception {
        int databaseSizeBeforeUpdate = monthlyOutgoingsInvoiceRepository.findAll().size();
        monthlyOutgoingsInvoice.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMonthlyOutgoingsInvoiceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(monthlyOutgoingsInvoice))
            )
            .andExpect(status().isBadRequest());

        // Validate the MonthlyOutgoingsInvoice in the database
        List<MonthlyOutgoingsInvoice> monthlyOutgoingsInvoiceList = monthlyOutgoingsInvoiceRepository.findAll();
        assertThat(monthlyOutgoingsInvoiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMonthlyOutgoingsInvoice() throws Exception {
        int databaseSizeBeforeUpdate = monthlyOutgoingsInvoiceRepository.findAll().size();
        monthlyOutgoingsInvoice.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMonthlyOutgoingsInvoiceMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(monthlyOutgoingsInvoice))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the MonthlyOutgoingsInvoice in the database
        List<MonthlyOutgoingsInvoice> monthlyOutgoingsInvoiceList = monthlyOutgoingsInvoiceRepository.findAll();
        assertThat(monthlyOutgoingsInvoiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMonthlyOutgoingsInvoiceWithPatch() throws Exception {
        // Initialize the database
        monthlyOutgoingsInvoiceRepository.saveAndFlush(monthlyOutgoingsInvoice);

        int databaseSizeBeforeUpdate = monthlyOutgoingsInvoiceRepository.findAll().size();

        // Update the monthlyOutgoingsInvoice using partial update
        MonthlyOutgoingsInvoice partialUpdatedMonthlyOutgoingsInvoice = new MonthlyOutgoingsInvoice();
        partialUpdatedMonthlyOutgoingsInvoice.setId(monthlyOutgoingsInvoice.getId());

        partialUpdatedMonthlyOutgoingsInvoice.date(UPDATED_DATE);

        restMonthlyOutgoingsInvoiceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMonthlyOutgoingsInvoice.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMonthlyOutgoingsInvoice))
            )
            .andExpect(status().isOk());

        // Validate the MonthlyOutgoingsInvoice in the database
        List<MonthlyOutgoingsInvoice> monthlyOutgoingsInvoiceList = monthlyOutgoingsInvoiceRepository.findAll();
        assertThat(monthlyOutgoingsInvoiceList).hasSize(databaseSizeBeforeUpdate);
        MonthlyOutgoingsInvoice testMonthlyOutgoingsInvoice = monthlyOutgoingsInvoiceList.get(monthlyOutgoingsInvoiceList.size() - 1);
        assertThat(testMonthlyOutgoingsInvoice.getTotal()).isEqualTo(DEFAULT_TOTAL);
        assertThat(testMonthlyOutgoingsInvoice.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void fullUpdateMonthlyOutgoingsInvoiceWithPatch() throws Exception {
        // Initialize the database
        monthlyOutgoingsInvoiceRepository.saveAndFlush(monthlyOutgoingsInvoice);

        int databaseSizeBeforeUpdate = monthlyOutgoingsInvoiceRepository.findAll().size();

        // Update the monthlyOutgoingsInvoice using partial update
        MonthlyOutgoingsInvoice partialUpdatedMonthlyOutgoingsInvoice = new MonthlyOutgoingsInvoice();
        partialUpdatedMonthlyOutgoingsInvoice.setId(monthlyOutgoingsInvoice.getId());

        partialUpdatedMonthlyOutgoingsInvoice.total(UPDATED_TOTAL).date(UPDATED_DATE);

        restMonthlyOutgoingsInvoiceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMonthlyOutgoingsInvoice.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMonthlyOutgoingsInvoice))
            )
            .andExpect(status().isOk());

        // Validate the MonthlyOutgoingsInvoice in the database
        List<MonthlyOutgoingsInvoice> monthlyOutgoingsInvoiceList = monthlyOutgoingsInvoiceRepository.findAll();
        assertThat(monthlyOutgoingsInvoiceList).hasSize(databaseSizeBeforeUpdate);
        MonthlyOutgoingsInvoice testMonthlyOutgoingsInvoice = monthlyOutgoingsInvoiceList.get(monthlyOutgoingsInvoiceList.size() - 1);
        assertThat(testMonthlyOutgoingsInvoice.getTotal()).isEqualTo(UPDATED_TOTAL);
        assertThat(testMonthlyOutgoingsInvoice.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingMonthlyOutgoingsInvoice() throws Exception {
        int databaseSizeBeforeUpdate = monthlyOutgoingsInvoiceRepository.findAll().size();
        monthlyOutgoingsInvoice.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMonthlyOutgoingsInvoiceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, monthlyOutgoingsInvoice.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(monthlyOutgoingsInvoice))
            )
            .andExpect(status().isBadRequest());

        // Validate the MonthlyOutgoingsInvoice in the database
        List<MonthlyOutgoingsInvoice> monthlyOutgoingsInvoiceList = monthlyOutgoingsInvoiceRepository.findAll();
        assertThat(monthlyOutgoingsInvoiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMonthlyOutgoingsInvoice() throws Exception {
        int databaseSizeBeforeUpdate = monthlyOutgoingsInvoiceRepository.findAll().size();
        monthlyOutgoingsInvoice.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMonthlyOutgoingsInvoiceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(monthlyOutgoingsInvoice))
            )
            .andExpect(status().isBadRequest());

        // Validate the MonthlyOutgoingsInvoice in the database
        List<MonthlyOutgoingsInvoice> monthlyOutgoingsInvoiceList = monthlyOutgoingsInvoiceRepository.findAll();
        assertThat(monthlyOutgoingsInvoiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMonthlyOutgoingsInvoice() throws Exception {
        int databaseSizeBeforeUpdate = monthlyOutgoingsInvoiceRepository.findAll().size();
        monthlyOutgoingsInvoice.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMonthlyOutgoingsInvoiceMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(monthlyOutgoingsInvoice))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the MonthlyOutgoingsInvoice in the database
        List<MonthlyOutgoingsInvoice> monthlyOutgoingsInvoiceList = monthlyOutgoingsInvoiceRepository.findAll();
        assertThat(monthlyOutgoingsInvoiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMonthlyOutgoingsInvoice() throws Exception {
        // Initialize the database
        monthlyOutgoingsInvoiceRepository.saveAndFlush(monthlyOutgoingsInvoice);

        int databaseSizeBeforeDelete = monthlyOutgoingsInvoiceRepository.findAll().size();

        // Delete the monthlyOutgoingsInvoice
        restMonthlyOutgoingsInvoiceMockMvc
            .perform(delete(ENTITY_API_URL_ID, monthlyOutgoingsInvoice.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<MonthlyOutgoingsInvoice> monthlyOutgoingsInvoiceList = monthlyOutgoingsInvoiceRepository.findAll();
        assertThat(monthlyOutgoingsInvoiceList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
