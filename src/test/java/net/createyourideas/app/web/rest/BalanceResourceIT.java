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
import net.createyourideas.app.domain.Balance;
import net.createyourideas.app.repository.BalanceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link BalanceResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class BalanceResourceIT {

    private static final Float DEFAULT_DAILY_BALANCE = 1F;
    private static final Float UPDATED_DAILY_BALANCE = 2F;

    private static final Float DEFAULT_NET_PROFIT = 1F;
    private static final Float UPDATED_NET_PROFIT = 2F;

    private static final ZonedDateTime DEFAULT_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final Boolean DEFAULT_BILLED = false;
    private static final Boolean UPDATED_BILLED = true;

    private static final String ENTITY_API_URL = "/api/balances";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private BalanceRepository balanceRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBalanceMockMvc;

    private Balance balance;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Balance createEntity(EntityManager em) {
        Balance balance = new Balance()
            .dailyBalance(DEFAULT_DAILY_BALANCE)
            .netProfit(DEFAULT_NET_PROFIT)
            .date(DEFAULT_DATE)
            .billed(DEFAULT_BILLED);
        return balance;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Balance createUpdatedEntity(EntityManager em) {
        Balance balance = new Balance()
            .dailyBalance(UPDATED_DAILY_BALANCE)
            .netProfit(UPDATED_NET_PROFIT)
            .date(UPDATED_DATE)
            .billed(UPDATED_BILLED);
        return balance;
    }

    @BeforeEach
    public void initTest() {
        balance = createEntity(em);
    }

    @Test
    @Transactional
    void createBalance() throws Exception {
        int databaseSizeBeforeCreate = balanceRepository.findAll().size();
        // Create the Balance
        restBalanceMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(balance))
            )
            .andExpect(status().isCreated());

        // Validate the Balance in the database
        List<Balance> balanceList = balanceRepository.findAll();
        assertThat(balanceList).hasSize(databaseSizeBeforeCreate + 1);
        Balance testBalance = balanceList.get(balanceList.size() - 1);
        assertThat(testBalance.getDailyBalance()).isEqualTo(DEFAULT_DAILY_BALANCE);
        assertThat(testBalance.getNetProfit()).isEqualTo(DEFAULT_NET_PROFIT);
        assertThat(testBalance.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testBalance.getBilled()).isEqualTo(DEFAULT_BILLED);
    }

    @Test
    @Transactional
    void createBalanceWithExistingId() throws Exception {
        // Create the Balance with an existing ID
        balance.setId(1L);

        int databaseSizeBeforeCreate = balanceRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restBalanceMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(balance))
            )
            .andExpect(status().isBadRequest());

        // Validate the Balance in the database
        List<Balance> balanceList = balanceRepository.findAll();
        assertThat(balanceList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllBalances() throws Exception {
        // Initialize the database
        balanceRepository.saveAndFlush(balance);

        // Get all the balanceList
        restBalanceMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(balance.getId().intValue())))
            .andExpect(jsonPath("$.[*].dailyBalance").value(hasItem(DEFAULT_DAILY_BALANCE.doubleValue())))
            .andExpect(jsonPath("$.[*].netProfit").value(hasItem(DEFAULT_NET_PROFIT.doubleValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(sameInstant(DEFAULT_DATE))))
            .andExpect(jsonPath("$.[*].billed").value(hasItem(DEFAULT_BILLED.booleanValue())));
    }

    @Test
    @Transactional
    void getBalance() throws Exception {
        // Initialize the database
        balanceRepository.saveAndFlush(balance);

        // Get the balance
        restBalanceMockMvc
            .perform(get(ENTITY_API_URL_ID, balance.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(balance.getId().intValue()))
            .andExpect(jsonPath("$.dailyBalance").value(DEFAULT_DAILY_BALANCE.doubleValue()))
            .andExpect(jsonPath("$.netProfit").value(DEFAULT_NET_PROFIT.doubleValue()))
            .andExpect(jsonPath("$.date").value(sameInstant(DEFAULT_DATE)))
            .andExpect(jsonPath("$.billed").value(DEFAULT_BILLED.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingBalance() throws Exception {
        // Get the balance
        restBalanceMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewBalance() throws Exception {
        // Initialize the database
        balanceRepository.saveAndFlush(balance);

        int databaseSizeBeforeUpdate = balanceRepository.findAll().size();

        // Update the balance
        Balance updatedBalance = balanceRepository.findById(balance.getId()).get();
        // Disconnect from session so that the updates on updatedBalance are not directly saved in db
        em.detach(updatedBalance);
        updatedBalance.dailyBalance(UPDATED_DAILY_BALANCE).netProfit(UPDATED_NET_PROFIT).date(UPDATED_DATE).billed(UPDATED_BILLED);

        restBalanceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedBalance.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedBalance))
            )
            .andExpect(status().isOk());

        // Validate the Balance in the database
        List<Balance> balanceList = balanceRepository.findAll();
        assertThat(balanceList).hasSize(databaseSizeBeforeUpdate);
        Balance testBalance = balanceList.get(balanceList.size() - 1);
        assertThat(testBalance.getDailyBalance()).isEqualTo(UPDATED_DAILY_BALANCE);
        assertThat(testBalance.getNetProfit()).isEqualTo(UPDATED_NET_PROFIT);
        assertThat(testBalance.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testBalance.getBilled()).isEqualTo(UPDATED_BILLED);
    }

    @Test
    @Transactional
    void putNonExistingBalance() throws Exception {
        int databaseSizeBeforeUpdate = balanceRepository.findAll().size();
        balance.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBalanceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, balance.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(balance))
            )
            .andExpect(status().isBadRequest());

        // Validate the Balance in the database
        List<Balance> balanceList = balanceRepository.findAll();
        assertThat(balanceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchBalance() throws Exception {
        int databaseSizeBeforeUpdate = balanceRepository.findAll().size();
        balance.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBalanceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(balance))
            )
            .andExpect(status().isBadRequest());

        // Validate the Balance in the database
        List<Balance> balanceList = balanceRepository.findAll();
        assertThat(balanceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamBalance() throws Exception {
        int databaseSizeBeforeUpdate = balanceRepository.findAll().size();
        balance.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBalanceMockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(balance))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Balance in the database
        List<Balance> balanceList = balanceRepository.findAll();
        assertThat(balanceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateBalanceWithPatch() throws Exception {
        // Initialize the database
        balanceRepository.saveAndFlush(balance);

        int databaseSizeBeforeUpdate = balanceRepository.findAll().size();

        // Update the balance using partial update
        Balance partialUpdatedBalance = new Balance();
        partialUpdatedBalance.setId(balance.getId());

        partialUpdatedBalance.dailyBalance(UPDATED_DAILY_BALANCE).netProfit(UPDATED_NET_PROFIT);

        restBalanceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBalance.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBalance))
            )
            .andExpect(status().isOk());

        // Validate the Balance in the database
        List<Balance> balanceList = balanceRepository.findAll();
        assertThat(balanceList).hasSize(databaseSizeBeforeUpdate);
        Balance testBalance = balanceList.get(balanceList.size() - 1);
        assertThat(testBalance.getDailyBalance()).isEqualTo(UPDATED_DAILY_BALANCE);
        assertThat(testBalance.getNetProfit()).isEqualTo(UPDATED_NET_PROFIT);
        assertThat(testBalance.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testBalance.getBilled()).isEqualTo(DEFAULT_BILLED);
    }

    @Test
    @Transactional
    void fullUpdateBalanceWithPatch() throws Exception {
        // Initialize the database
        balanceRepository.saveAndFlush(balance);

        int databaseSizeBeforeUpdate = balanceRepository.findAll().size();

        // Update the balance using partial update
        Balance partialUpdatedBalance = new Balance();
        partialUpdatedBalance.setId(balance.getId());

        partialUpdatedBalance.dailyBalance(UPDATED_DAILY_BALANCE).netProfit(UPDATED_NET_PROFIT).date(UPDATED_DATE).billed(UPDATED_BILLED);

        restBalanceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBalance.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBalance))
            )
            .andExpect(status().isOk());

        // Validate the Balance in the database
        List<Balance> balanceList = balanceRepository.findAll();
        assertThat(balanceList).hasSize(databaseSizeBeforeUpdate);
        Balance testBalance = balanceList.get(balanceList.size() - 1);
        assertThat(testBalance.getDailyBalance()).isEqualTo(UPDATED_DAILY_BALANCE);
        assertThat(testBalance.getNetProfit()).isEqualTo(UPDATED_NET_PROFIT);
        assertThat(testBalance.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testBalance.getBilled()).isEqualTo(UPDATED_BILLED);
    }

    @Test
    @Transactional
    void patchNonExistingBalance() throws Exception {
        int databaseSizeBeforeUpdate = balanceRepository.findAll().size();
        balance.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBalanceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, balance.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(balance))
            )
            .andExpect(status().isBadRequest());

        // Validate the Balance in the database
        List<Balance> balanceList = balanceRepository.findAll();
        assertThat(balanceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchBalance() throws Exception {
        int databaseSizeBeforeUpdate = balanceRepository.findAll().size();
        balance.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBalanceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(balance))
            )
            .andExpect(status().isBadRequest());

        // Validate the Balance in the database
        List<Balance> balanceList = balanceRepository.findAll();
        assertThat(balanceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamBalance() throws Exception {
        int databaseSizeBeforeUpdate = balanceRepository.findAll().size();
        balance.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBalanceMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(balance))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Balance in the database
        List<Balance> balanceList = balanceRepository.findAll();
        assertThat(balanceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteBalance() throws Exception {
        // Initialize the database
        balanceRepository.saveAndFlush(balance);

        int databaseSizeBeforeDelete = balanceRepository.findAll().size();

        // Delete the balance
        restBalanceMockMvc
            .perform(delete(ENTITY_API_URL_ID, balance.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Balance> balanceList = balanceRepository.findAll();
        assertThat(balanceList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
