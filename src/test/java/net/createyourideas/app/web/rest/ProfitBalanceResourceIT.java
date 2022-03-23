package net.createyourideas.app.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import net.createyourideas.app.IntegrationTest;
import net.createyourideas.app.domain.ProfitBalance;
import net.createyourideas.app.repository.ProfitBalanceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ProfitBalanceResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ProfitBalanceResourceIT {

    private static final Float DEFAULT_PROFIT = 1F;
    private static final Float UPDATED_PROFIT = 2F;

    private static final Float DEFAULT_PROFIT_TO_SPEND = 1F;
    private static final Float UPDATED_PROFIT_TO_SPEND = 2F;

    private static final Float DEFAULT_NET_PROFIT = 1F;
    private static final Float UPDATED_NET_PROFIT = 2F;

    private static final LocalDate DEFAULT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/profit-balances";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ProfitBalanceRepository profitBalanceRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restProfitBalanceMockMvc;

    private ProfitBalance profitBalance;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProfitBalance createEntity(EntityManager em) {
        ProfitBalance profitBalance = new ProfitBalance()
            .profit(DEFAULT_PROFIT)
            .profitToSpend(DEFAULT_PROFIT_TO_SPEND)
            .netProfit(DEFAULT_NET_PROFIT)
            .date(DEFAULT_DATE);
        return profitBalance;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProfitBalance createUpdatedEntity(EntityManager em) {
        ProfitBalance profitBalance = new ProfitBalance()
            .profit(UPDATED_PROFIT)
            .profitToSpend(UPDATED_PROFIT_TO_SPEND)
            .netProfit(UPDATED_NET_PROFIT)
            .date(UPDATED_DATE);
        return profitBalance;
    }

    @BeforeEach
    public void initTest() {
        profitBalance = createEntity(em);
    }

    @Test
    @Transactional
    void createProfitBalance() throws Exception {
        int databaseSizeBeforeCreate = profitBalanceRepository.findAll().size();
        // Create the ProfitBalance
        restProfitBalanceMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(profitBalance))
            )
            .andExpect(status().isCreated());

        // Validate the ProfitBalance in the database
        List<ProfitBalance> profitBalanceList = profitBalanceRepository.findAll();
        assertThat(profitBalanceList).hasSize(databaseSizeBeforeCreate + 1);
        ProfitBalance testProfitBalance = profitBalanceList.get(profitBalanceList.size() - 1);
        assertThat(testProfitBalance.getProfit()).isEqualTo(DEFAULT_PROFIT);
        assertThat(testProfitBalance.getProfitToSpend()).isEqualTo(DEFAULT_PROFIT_TO_SPEND);
        assertThat(testProfitBalance.getNetProfit()).isEqualTo(DEFAULT_NET_PROFIT);
        assertThat(testProfitBalance.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    void createProfitBalanceWithExistingId() throws Exception {
        // Create the ProfitBalance with an existing ID
        profitBalance.setId(1L);

        int databaseSizeBeforeCreate = profitBalanceRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restProfitBalanceMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(profitBalance))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProfitBalance in the database
        List<ProfitBalance> profitBalanceList = profitBalanceRepository.findAll();
        assertThat(profitBalanceList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllProfitBalances() throws Exception {
        // Initialize the database
        profitBalanceRepository.saveAndFlush(profitBalance);

        // Get all the profitBalanceList
        restProfitBalanceMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(profitBalance.getId().intValue())))
            .andExpect(jsonPath("$.[*].profit").value(hasItem(DEFAULT_PROFIT.doubleValue())))
            .andExpect(jsonPath("$.[*].profitToSpend").value(hasItem(DEFAULT_PROFIT_TO_SPEND.doubleValue())))
            .andExpect(jsonPath("$.[*].netProfit").value(hasItem(DEFAULT_NET_PROFIT.doubleValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())));
    }

    @Test
    @Transactional
    void getProfitBalance() throws Exception {
        // Initialize the database
        profitBalanceRepository.saveAndFlush(profitBalance);

        // Get the profitBalance
        restProfitBalanceMockMvc
            .perform(get(ENTITY_API_URL_ID, profitBalance.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(profitBalance.getId().intValue()))
            .andExpect(jsonPath("$.profit").value(DEFAULT_PROFIT.doubleValue()))
            .andExpect(jsonPath("$.profitToSpend").value(DEFAULT_PROFIT_TO_SPEND.doubleValue()))
            .andExpect(jsonPath("$.netProfit").value(DEFAULT_NET_PROFIT.doubleValue()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingProfitBalance() throws Exception {
        // Get the profitBalance
        restProfitBalanceMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewProfitBalance() throws Exception {
        // Initialize the database
        profitBalanceRepository.saveAndFlush(profitBalance);

        int databaseSizeBeforeUpdate = profitBalanceRepository.findAll().size();

        // Update the profitBalance
        ProfitBalance updatedProfitBalance = profitBalanceRepository.findById(profitBalance.getId()).get();
        // Disconnect from session so that the updates on updatedProfitBalance are not directly saved in db
        em.detach(updatedProfitBalance);
        updatedProfitBalance.profit(UPDATED_PROFIT).profitToSpend(UPDATED_PROFIT_TO_SPEND).netProfit(UPDATED_NET_PROFIT).date(UPDATED_DATE);

        restProfitBalanceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedProfitBalance.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedProfitBalance))
            )
            .andExpect(status().isOk());

        // Validate the ProfitBalance in the database
        List<ProfitBalance> profitBalanceList = profitBalanceRepository.findAll();
        assertThat(profitBalanceList).hasSize(databaseSizeBeforeUpdate);
        ProfitBalance testProfitBalance = profitBalanceList.get(profitBalanceList.size() - 1);
        assertThat(testProfitBalance.getProfit()).isEqualTo(UPDATED_PROFIT);
        assertThat(testProfitBalance.getProfitToSpend()).isEqualTo(UPDATED_PROFIT_TO_SPEND);
        assertThat(testProfitBalance.getNetProfit()).isEqualTo(UPDATED_NET_PROFIT);
        assertThat(testProfitBalance.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void putNonExistingProfitBalance() throws Exception {
        int databaseSizeBeforeUpdate = profitBalanceRepository.findAll().size();
        profitBalance.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProfitBalanceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, profitBalance.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(profitBalance))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProfitBalance in the database
        List<ProfitBalance> profitBalanceList = profitBalanceRepository.findAll();
        assertThat(profitBalanceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchProfitBalance() throws Exception {
        int databaseSizeBeforeUpdate = profitBalanceRepository.findAll().size();
        profitBalance.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProfitBalanceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(profitBalance))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProfitBalance in the database
        List<ProfitBalance> profitBalanceList = profitBalanceRepository.findAll();
        assertThat(profitBalanceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamProfitBalance() throws Exception {
        int databaseSizeBeforeUpdate = profitBalanceRepository.findAll().size();
        profitBalance.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProfitBalanceMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(profitBalance))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProfitBalance in the database
        List<ProfitBalance> profitBalanceList = profitBalanceRepository.findAll();
        assertThat(profitBalanceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateProfitBalanceWithPatch() throws Exception {
        // Initialize the database
        profitBalanceRepository.saveAndFlush(profitBalance);

        int databaseSizeBeforeUpdate = profitBalanceRepository.findAll().size();

        // Update the profitBalance using partial update
        ProfitBalance partialUpdatedProfitBalance = new ProfitBalance();
        partialUpdatedProfitBalance.setId(profitBalance.getId());

        partialUpdatedProfitBalance.profit(UPDATED_PROFIT).netProfit(UPDATED_NET_PROFIT).date(UPDATED_DATE);

        restProfitBalanceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProfitBalance.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProfitBalance))
            )
            .andExpect(status().isOk());

        // Validate the ProfitBalance in the database
        List<ProfitBalance> profitBalanceList = profitBalanceRepository.findAll();
        assertThat(profitBalanceList).hasSize(databaseSizeBeforeUpdate);
        ProfitBalance testProfitBalance = profitBalanceList.get(profitBalanceList.size() - 1);
        assertThat(testProfitBalance.getProfit()).isEqualTo(UPDATED_PROFIT);
        assertThat(testProfitBalance.getProfitToSpend()).isEqualTo(DEFAULT_PROFIT_TO_SPEND);
        assertThat(testProfitBalance.getNetProfit()).isEqualTo(UPDATED_NET_PROFIT);
        assertThat(testProfitBalance.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void fullUpdateProfitBalanceWithPatch() throws Exception {
        // Initialize the database
        profitBalanceRepository.saveAndFlush(profitBalance);

        int databaseSizeBeforeUpdate = profitBalanceRepository.findAll().size();

        // Update the profitBalance using partial update
        ProfitBalance partialUpdatedProfitBalance = new ProfitBalance();
        partialUpdatedProfitBalance.setId(profitBalance.getId());

        partialUpdatedProfitBalance
            .profit(UPDATED_PROFIT)
            .profitToSpend(UPDATED_PROFIT_TO_SPEND)
            .netProfit(UPDATED_NET_PROFIT)
            .date(UPDATED_DATE);

        restProfitBalanceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProfitBalance.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProfitBalance))
            )
            .andExpect(status().isOk());

        // Validate the ProfitBalance in the database
        List<ProfitBalance> profitBalanceList = profitBalanceRepository.findAll();
        assertThat(profitBalanceList).hasSize(databaseSizeBeforeUpdate);
        ProfitBalance testProfitBalance = profitBalanceList.get(profitBalanceList.size() - 1);
        assertThat(testProfitBalance.getProfit()).isEqualTo(UPDATED_PROFIT);
        assertThat(testProfitBalance.getProfitToSpend()).isEqualTo(UPDATED_PROFIT_TO_SPEND);
        assertThat(testProfitBalance.getNetProfit()).isEqualTo(UPDATED_NET_PROFIT);
        assertThat(testProfitBalance.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingProfitBalance() throws Exception {
        int databaseSizeBeforeUpdate = profitBalanceRepository.findAll().size();
        profitBalance.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProfitBalanceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, profitBalance.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(profitBalance))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProfitBalance in the database
        List<ProfitBalance> profitBalanceList = profitBalanceRepository.findAll();
        assertThat(profitBalanceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchProfitBalance() throws Exception {
        int databaseSizeBeforeUpdate = profitBalanceRepository.findAll().size();
        profitBalance.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProfitBalanceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(profitBalance))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProfitBalance in the database
        List<ProfitBalance> profitBalanceList = profitBalanceRepository.findAll();
        assertThat(profitBalanceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamProfitBalance() throws Exception {
        int databaseSizeBeforeUpdate = profitBalanceRepository.findAll().size();
        profitBalance.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProfitBalanceMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(profitBalance))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProfitBalance in the database
        List<ProfitBalance> profitBalanceList = profitBalanceRepository.findAll();
        assertThat(profitBalanceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteProfitBalance() throws Exception {
        // Initialize the database
        profitBalanceRepository.saveAndFlush(profitBalance);

        int databaseSizeBeforeDelete = profitBalanceRepository.findAll().size();

        // Delete the profitBalance
        restProfitBalanceMockMvc
            .perform(delete(ENTITY_API_URL_ID, profitBalance.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ProfitBalance> profitBalanceList = profitBalanceRepository.findAll();
        assertThat(profitBalanceList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
