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
import net.createyourideas.app.domain.MonthlyIncomeInvoice;
import net.createyourideas.app.repository.MonthlyIncomeInvoiceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link MonthlyIncomeInvoiceResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class MonthlyIncomeInvoiceResourceIT {

    private static final Float DEFAULT_TOTAL = 1F;
    private static final Float UPDATED_TOTAL = 2F;

    private static final ZonedDateTime DEFAULT_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/monthly-income-invoices";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MonthlyIncomeInvoiceRepository monthlyIncomeInvoiceRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMonthlyIncomeInvoiceMockMvc;

    private MonthlyIncomeInvoice monthlyIncomeInvoice;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MonthlyIncomeInvoice createEntity(EntityManager em) {
        MonthlyIncomeInvoice monthlyIncomeInvoice = new MonthlyIncomeInvoice().total(DEFAULT_TOTAL).date(DEFAULT_DATE);
        return monthlyIncomeInvoice;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MonthlyIncomeInvoice createUpdatedEntity(EntityManager em) {
        MonthlyIncomeInvoice monthlyIncomeInvoice = new MonthlyIncomeInvoice().total(UPDATED_TOTAL).date(UPDATED_DATE);
        return monthlyIncomeInvoice;
    }

    @BeforeEach
    public void initTest() {
        monthlyIncomeInvoice = createEntity(em);
    }

    @Test
    @Transactional
    void createMonthlyIncomeInvoice() throws Exception {
        int databaseSizeBeforeCreate = monthlyIncomeInvoiceRepository.findAll().size();
        // Create the MonthlyIncomeInvoice
        restMonthlyIncomeInvoiceMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(monthlyIncomeInvoice))
            )
            .andExpect(status().isCreated());

        // Validate the MonthlyIncomeInvoice in the database
        List<MonthlyIncomeInvoice> monthlyIncomeInvoiceList = monthlyIncomeInvoiceRepository.findAll();
        assertThat(monthlyIncomeInvoiceList).hasSize(databaseSizeBeforeCreate + 1);
        MonthlyIncomeInvoice testMonthlyIncomeInvoice = monthlyIncomeInvoiceList.get(monthlyIncomeInvoiceList.size() - 1);
        assertThat(testMonthlyIncomeInvoice.getTotal()).isEqualTo(DEFAULT_TOTAL);
        assertThat(testMonthlyIncomeInvoice.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    void createMonthlyIncomeInvoiceWithExistingId() throws Exception {
        // Create the MonthlyIncomeInvoice with an existing ID
        monthlyIncomeInvoice.setId(1L);

        int databaseSizeBeforeCreate = monthlyIncomeInvoiceRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMonthlyIncomeInvoiceMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(monthlyIncomeInvoice))
            )
            .andExpect(status().isBadRequest());

        // Validate the MonthlyIncomeInvoice in the database
        List<MonthlyIncomeInvoice> monthlyIncomeInvoiceList = monthlyIncomeInvoiceRepository.findAll();
        assertThat(monthlyIncomeInvoiceList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllMonthlyIncomeInvoices() throws Exception {
        // Initialize the database
        monthlyIncomeInvoiceRepository.saveAndFlush(monthlyIncomeInvoice);

        // Get all the monthlyIncomeInvoiceList
        restMonthlyIncomeInvoiceMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(monthlyIncomeInvoice.getId().intValue())))
            .andExpect(jsonPath("$.[*].total").value(hasItem(DEFAULT_TOTAL.doubleValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(sameInstant(DEFAULT_DATE))));
    }

    @Test
    @Transactional
    void getMonthlyIncomeInvoice() throws Exception {
        // Initialize the database
        monthlyIncomeInvoiceRepository.saveAndFlush(monthlyIncomeInvoice);

        // Get the monthlyIncomeInvoice
        restMonthlyIncomeInvoiceMockMvc
            .perform(get(ENTITY_API_URL_ID, monthlyIncomeInvoice.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(monthlyIncomeInvoice.getId().intValue()))
            .andExpect(jsonPath("$.total").value(DEFAULT_TOTAL.doubleValue()))
            .andExpect(jsonPath("$.date").value(sameInstant(DEFAULT_DATE)));
    }

    @Test
    @Transactional
    void getNonExistingMonthlyIncomeInvoice() throws Exception {
        // Get the monthlyIncomeInvoice
        restMonthlyIncomeInvoiceMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewMonthlyIncomeInvoice() throws Exception {
        // Initialize the database
        monthlyIncomeInvoiceRepository.saveAndFlush(monthlyIncomeInvoice);

        int databaseSizeBeforeUpdate = monthlyIncomeInvoiceRepository.findAll().size();

        // Update the monthlyIncomeInvoice
        MonthlyIncomeInvoice updatedMonthlyIncomeInvoice = monthlyIncomeInvoiceRepository.findById(monthlyIncomeInvoice.getId()).get();
        // Disconnect from session so that the updates on updatedMonthlyIncomeInvoice are not directly saved in db
        em.detach(updatedMonthlyIncomeInvoice);
        updatedMonthlyIncomeInvoice.total(UPDATED_TOTAL).date(UPDATED_DATE);

        restMonthlyIncomeInvoiceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMonthlyIncomeInvoice.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMonthlyIncomeInvoice))
            )
            .andExpect(status().isOk());

        // Validate the MonthlyIncomeInvoice in the database
        List<MonthlyIncomeInvoice> monthlyIncomeInvoiceList = monthlyIncomeInvoiceRepository.findAll();
        assertThat(monthlyIncomeInvoiceList).hasSize(databaseSizeBeforeUpdate);
        MonthlyIncomeInvoice testMonthlyIncomeInvoice = monthlyIncomeInvoiceList.get(monthlyIncomeInvoiceList.size() - 1);
        assertThat(testMonthlyIncomeInvoice.getTotal()).isEqualTo(UPDATED_TOTAL);
        assertThat(testMonthlyIncomeInvoice.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void putNonExistingMonthlyIncomeInvoice() throws Exception {
        int databaseSizeBeforeUpdate = monthlyIncomeInvoiceRepository.findAll().size();
        monthlyIncomeInvoice.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMonthlyIncomeInvoiceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, monthlyIncomeInvoice.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(monthlyIncomeInvoice))
            )
            .andExpect(status().isBadRequest());

        // Validate the MonthlyIncomeInvoice in the database
        List<MonthlyIncomeInvoice> monthlyIncomeInvoiceList = monthlyIncomeInvoiceRepository.findAll();
        assertThat(monthlyIncomeInvoiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMonthlyIncomeInvoice() throws Exception {
        int databaseSizeBeforeUpdate = monthlyIncomeInvoiceRepository.findAll().size();
        monthlyIncomeInvoice.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMonthlyIncomeInvoiceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(monthlyIncomeInvoice))
            )
            .andExpect(status().isBadRequest());

        // Validate the MonthlyIncomeInvoice in the database
        List<MonthlyIncomeInvoice> monthlyIncomeInvoiceList = monthlyIncomeInvoiceRepository.findAll();
        assertThat(monthlyIncomeInvoiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMonthlyIncomeInvoice() throws Exception {
        int databaseSizeBeforeUpdate = monthlyIncomeInvoiceRepository.findAll().size();
        monthlyIncomeInvoice.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMonthlyIncomeInvoiceMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(monthlyIncomeInvoice))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the MonthlyIncomeInvoice in the database
        List<MonthlyIncomeInvoice> monthlyIncomeInvoiceList = monthlyIncomeInvoiceRepository.findAll();
        assertThat(monthlyIncomeInvoiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMonthlyIncomeInvoiceWithPatch() throws Exception {
        // Initialize the database
        monthlyIncomeInvoiceRepository.saveAndFlush(monthlyIncomeInvoice);

        int databaseSizeBeforeUpdate = monthlyIncomeInvoiceRepository.findAll().size();

        // Update the monthlyIncomeInvoice using partial update
        MonthlyIncomeInvoice partialUpdatedMonthlyIncomeInvoice = new MonthlyIncomeInvoice();
        partialUpdatedMonthlyIncomeInvoice.setId(monthlyIncomeInvoice.getId());

        partialUpdatedMonthlyIncomeInvoice.total(UPDATED_TOTAL);

        restMonthlyIncomeInvoiceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMonthlyIncomeInvoice.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMonthlyIncomeInvoice))
            )
            .andExpect(status().isOk());

        // Validate the MonthlyIncomeInvoice in the database
        List<MonthlyIncomeInvoice> monthlyIncomeInvoiceList = monthlyIncomeInvoiceRepository.findAll();
        assertThat(monthlyIncomeInvoiceList).hasSize(databaseSizeBeforeUpdate);
        MonthlyIncomeInvoice testMonthlyIncomeInvoice = monthlyIncomeInvoiceList.get(monthlyIncomeInvoiceList.size() - 1);
        assertThat(testMonthlyIncomeInvoice.getTotal()).isEqualTo(UPDATED_TOTAL);
        assertThat(testMonthlyIncomeInvoice.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    void fullUpdateMonthlyIncomeInvoiceWithPatch() throws Exception {
        // Initialize the database
        monthlyIncomeInvoiceRepository.saveAndFlush(monthlyIncomeInvoice);

        int databaseSizeBeforeUpdate = monthlyIncomeInvoiceRepository.findAll().size();

        // Update the monthlyIncomeInvoice using partial update
        MonthlyIncomeInvoice partialUpdatedMonthlyIncomeInvoice = new MonthlyIncomeInvoice();
        partialUpdatedMonthlyIncomeInvoice.setId(monthlyIncomeInvoice.getId());

        partialUpdatedMonthlyIncomeInvoice.total(UPDATED_TOTAL).date(UPDATED_DATE);

        restMonthlyIncomeInvoiceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMonthlyIncomeInvoice.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMonthlyIncomeInvoice))
            )
            .andExpect(status().isOk());

        // Validate the MonthlyIncomeInvoice in the database
        List<MonthlyIncomeInvoice> monthlyIncomeInvoiceList = monthlyIncomeInvoiceRepository.findAll();
        assertThat(monthlyIncomeInvoiceList).hasSize(databaseSizeBeforeUpdate);
        MonthlyIncomeInvoice testMonthlyIncomeInvoice = monthlyIncomeInvoiceList.get(monthlyIncomeInvoiceList.size() - 1);
        assertThat(testMonthlyIncomeInvoice.getTotal()).isEqualTo(UPDATED_TOTAL);
        assertThat(testMonthlyIncomeInvoice.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingMonthlyIncomeInvoice() throws Exception {
        int databaseSizeBeforeUpdate = monthlyIncomeInvoiceRepository.findAll().size();
        monthlyIncomeInvoice.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMonthlyIncomeInvoiceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, monthlyIncomeInvoice.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(monthlyIncomeInvoice))
            )
            .andExpect(status().isBadRequest());

        // Validate the MonthlyIncomeInvoice in the database
        List<MonthlyIncomeInvoice> monthlyIncomeInvoiceList = monthlyIncomeInvoiceRepository.findAll();
        assertThat(monthlyIncomeInvoiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMonthlyIncomeInvoice() throws Exception {
        int databaseSizeBeforeUpdate = monthlyIncomeInvoiceRepository.findAll().size();
        monthlyIncomeInvoice.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMonthlyIncomeInvoiceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(monthlyIncomeInvoice))
            )
            .andExpect(status().isBadRequest());

        // Validate the MonthlyIncomeInvoice in the database
        List<MonthlyIncomeInvoice> monthlyIncomeInvoiceList = monthlyIncomeInvoiceRepository.findAll();
        assertThat(monthlyIncomeInvoiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMonthlyIncomeInvoice() throws Exception {
        int databaseSizeBeforeUpdate = monthlyIncomeInvoiceRepository.findAll().size();
        monthlyIncomeInvoice.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMonthlyIncomeInvoiceMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(monthlyIncomeInvoice))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the MonthlyIncomeInvoice in the database
        List<MonthlyIncomeInvoice> monthlyIncomeInvoiceList = monthlyIncomeInvoiceRepository.findAll();
        assertThat(monthlyIncomeInvoiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMonthlyIncomeInvoice() throws Exception {
        // Initialize the database
        monthlyIncomeInvoiceRepository.saveAndFlush(monthlyIncomeInvoice);

        int databaseSizeBeforeDelete = monthlyIncomeInvoiceRepository.findAll().size();

        // Delete the monthlyIncomeInvoice
        restMonthlyIncomeInvoiceMockMvc
            .perform(delete(ENTITY_API_URL_ID, monthlyIncomeInvoice.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<MonthlyIncomeInvoice> monthlyIncomeInvoiceList = monthlyIncomeInvoiceRepository.findAll();
        assertThat(monthlyIncomeInvoiceList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
