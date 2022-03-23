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
import net.createyourideas.app.domain.IdeaTransactionId;
import net.createyourideas.app.repository.IdeaTransactionIdRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link IdeaTransactionIdResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class IdeaTransactionIdResourceIT {

    private static final String DEFAULT_TRANSACTION_ID = "AAAAAAAAAA";
    private static final String UPDATED_TRANSACTION_ID = "BBBBBBBBBB";

    private static final String DEFAULT_REF_NO = "AAAAAAAAAA";
    private static final String UPDATED_REF_NO = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/idea-transaction-ids";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private IdeaTransactionIdRepository ideaTransactionIdRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restIdeaTransactionIdMockMvc;

    private IdeaTransactionId ideaTransactionId;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static IdeaTransactionId createEntity(EntityManager em) {
        IdeaTransactionId ideaTransactionId = new IdeaTransactionId()
            .transactionId(DEFAULT_TRANSACTION_ID)
            .refNo(DEFAULT_REF_NO)
            .date(DEFAULT_DATE);
        return ideaTransactionId;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static IdeaTransactionId createUpdatedEntity(EntityManager em) {
        IdeaTransactionId ideaTransactionId = new IdeaTransactionId()
            .transactionId(UPDATED_TRANSACTION_ID)
            .refNo(UPDATED_REF_NO)
            .date(UPDATED_DATE);
        return ideaTransactionId;
    }

    @BeforeEach
    public void initTest() {
        ideaTransactionId = createEntity(em);
    }

    @Test
    @Transactional
    void createIdeaTransactionId() throws Exception {
        int databaseSizeBeforeCreate = ideaTransactionIdRepository.findAll().size();
        // Create the IdeaTransactionId
        restIdeaTransactionIdMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(ideaTransactionId))
            )
            .andExpect(status().isCreated());

        // Validate the IdeaTransactionId in the database
        List<IdeaTransactionId> ideaTransactionIdList = ideaTransactionIdRepository.findAll();
        assertThat(ideaTransactionIdList).hasSize(databaseSizeBeforeCreate + 1);
        IdeaTransactionId testIdeaTransactionId = ideaTransactionIdList.get(ideaTransactionIdList.size() - 1);
        assertThat(testIdeaTransactionId.getTransactionId()).isEqualTo(DEFAULT_TRANSACTION_ID);
        assertThat(testIdeaTransactionId.getRefNo()).isEqualTo(DEFAULT_REF_NO);
        assertThat(testIdeaTransactionId.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    void createIdeaTransactionIdWithExistingId() throws Exception {
        // Create the IdeaTransactionId with an existing ID
        ideaTransactionId.setId(1L);

        int databaseSizeBeforeCreate = ideaTransactionIdRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restIdeaTransactionIdMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(ideaTransactionId))
            )
            .andExpect(status().isBadRequest());

        // Validate the IdeaTransactionId in the database
        List<IdeaTransactionId> ideaTransactionIdList = ideaTransactionIdRepository.findAll();
        assertThat(ideaTransactionIdList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllIdeaTransactionIds() throws Exception {
        // Initialize the database
        ideaTransactionIdRepository.saveAndFlush(ideaTransactionId);

        // Get all the ideaTransactionIdList
        restIdeaTransactionIdMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(ideaTransactionId.getId().intValue())))
            .andExpect(jsonPath("$.[*].transactionId").value(hasItem(DEFAULT_TRANSACTION_ID)))
            .andExpect(jsonPath("$.[*].refNo").value(hasItem(DEFAULT_REF_NO)))
            .andExpect(jsonPath("$.[*].date").value(hasItem(sameInstant(DEFAULT_DATE))));
    }

    @Test
    @Transactional
    void getIdeaTransactionId() throws Exception {
        // Initialize the database
        ideaTransactionIdRepository.saveAndFlush(ideaTransactionId);

        // Get the ideaTransactionId
        restIdeaTransactionIdMockMvc
            .perform(get(ENTITY_API_URL_ID, ideaTransactionId.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(ideaTransactionId.getId().intValue()))
            .andExpect(jsonPath("$.transactionId").value(DEFAULT_TRANSACTION_ID))
            .andExpect(jsonPath("$.refNo").value(DEFAULT_REF_NO))
            .andExpect(jsonPath("$.date").value(sameInstant(DEFAULT_DATE)));
    }

    @Test
    @Transactional
    void getNonExistingIdeaTransactionId() throws Exception {
        // Get the ideaTransactionId
        restIdeaTransactionIdMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewIdeaTransactionId() throws Exception {
        // Initialize the database
        ideaTransactionIdRepository.saveAndFlush(ideaTransactionId);

        int databaseSizeBeforeUpdate = ideaTransactionIdRepository.findAll().size();

        // Update the ideaTransactionId
        IdeaTransactionId updatedIdeaTransactionId = ideaTransactionIdRepository.findById(ideaTransactionId.getId()).get();
        // Disconnect from session so that the updates on updatedIdeaTransactionId are not directly saved in db
        em.detach(updatedIdeaTransactionId);
        updatedIdeaTransactionId.transactionId(UPDATED_TRANSACTION_ID).refNo(UPDATED_REF_NO).date(UPDATED_DATE);

        restIdeaTransactionIdMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedIdeaTransactionId.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedIdeaTransactionId))
            )
            .andExpect(status().isOk());

        // Validate the IdeaTransactionId in the database
        List<IdeaTransactionId> ideaTransactionIdList = ideaTransactionIdRepository.findAll();
        assertThat(ideaTransactionIdList).hasSize(databaseSizeBeforeUpdate);
        IdeaTransactionId testIdeaTransactionId = ideaTransactionIdList.get(ideaTransactionIdList.size() - 1);
        assertThat(testIdeaTransactionId.getTransactionId()).isEqualTo(UPDATED_TRANSACTION_ID);
        assertThat(testIdeaTransactionId.getRefNo()).isEqualTo(UPDATED_REF_NO);
        assertThat(testIdeaTransactionId.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void putNonExistingIdeaTransactionId() throws Exception {
        int databaseSizeBeforeUpdate = ideaTransactionIdRepository.findAll().size();
        ideaTransactionId.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restIdeaTransactionIdMockMvc
            .perform(
                put(ENTITY_API_URL_ID, ideaTransactionId.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(ideaTransactionId))
            )
            .andExpect(status().isBadRequest());

        // Validate the IdeaTransactionId in the database
        List<IdeaTransactionId> ideaTransactionIdList = ideaTransactionIdRepository.findAll();
        assertThat(ideaTransactionIdList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchIdeaTransactionId() throws Exception {
        int databaseSizeBeforeUpdate = ideaTransactionIdRepository.findAll().size();
        ideaTransactionId.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIdeaTransactionIdMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(ideaTransactionId))
            )
            .andExpect(status().isBadRequest());

        // Validate the IdeaTransactionId in the database
        List<IdeaTransactionId> ideaTransactionIdList = ideaTransactionIdRepository.findAll();
        assertThat(ideaTransactionIdList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamIdeaTransactionId() throws Exception {
        int databaseSizeBeforeUpdate = ideaTransactionIdRepository.findAll().size();
        ideaTransactionId.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIdeaTransactionIdMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(ideaTransactionId))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the IdeaTransactionId in the database
        List<IdeaTransactionId> ideaTransactionIdList = ideaTransactionIdRepository.findAll();
        assertThat(ideaTransactionIdList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateIdeaTransactionIdWithPatch() throws Exception {
        // Initialize the database
        ideaTransactionIdRepository.saveAndFlush(ideaTransactionId);

        int databaseSizeBeforeUpdate = ideaTransactionIdRepository.findAll().size();

        // Update the ideaTransactionId using partial update
        IdeaTransactionId partialUpdatedIdeaTransactionId = new IdeaTransactionId();
        partialUpdatedIdeaTransactionId.setId(ideaTransactionId.getId());

        restIdeaTransactionIdMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedIdeaTransactionId.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedIdeaTransactionId))
            )
            .andExpect(status().isOk());

        // Validate the IdeaTransactionId in the database
        List<IdeaTransactionId> ideaTransactionIdList = ideaTransactionIdRepository.findAll();
        assertThat(ideaTransactionIdList).hasSize(databaseSizeBeforeUpdate);
        IdeaTransactionId testIdeaTransactionId = ideaTransactionIdList.get(ideaTransactionIdList.size() - 1);
        assertThat(testIdeaTransactionId.getTransactionId()).isEqualTo(DEFAULT_TRANSACTION_ID);
        assertThat(testIdeaTransactionId.getRefNo()).isEqualTo(DEFAULT_REF_NO);
        assertThat(testIdeaTransactionId.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    void fullUpdateIdeaTransactionIdWithPatch() throws Exception {
        // Initialize the database
        ideaTransactionIdRepository.saveAndFlush(ideaTransactionId);

        int databaseSizeBeforeUpdate = ideaTransactionIdRepository.findAll().size();

        // Update the ideaTransactionId using partial update
        IdeaTransactionId partialUpdatedIdeaTransactionId = new IdeaTransactionId();
        partialUpdatedIdeaTransactionId.setId(ideaTransactionId.getId());

        partialUpdatedIdeaTransactionId.transactionId(UPDATED_TRANSACTION_ID).refNo(UPDATED_REF_NO).date(UPDATED_DATE);

        restIdeaTransactionIdMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedIdeaTransactionId.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedIdeaTransactionId))
            )
            .andExpect(status().isOk());

        // Validate the IdeaTransactionId in the database
        List<IdeaTransactionId> ideaTransactionIdList = ideaTransactionIdRepository.findAll();
        assertThat(ideaTransactionIdList).hasSize(databaseSizeBeforeUpdate);
        IdeaTransactionId testIdeaTransactionId = ideaTransactionIdList.get(ideaTransactionIdList.size() - 1);
        assertThat(testIdeaTransactionId.getTransactionId()).isEqualTo(UPDATED_TRANSACTION_ID);
        assertThat(testIdeaTransactionId.getRefNo()).isEqualTo(UPDATED_REF_NO);
        assertThat(testIdeaTransactionId.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingIdeaTransactionId() throws Exception {
        int databaseSizeBeforeUpdate = ideaTransactionIdRepository.findAll().size();
        ideaTransactionId.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restIdeaTransactionIdMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, ideaTransactionId.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(ideaTransactionId))
            )
            .andExpect(status().isBadRequest());

        // Validate the IdeaTransactionId in the database
        List<IdeaTransactionId> ideaTransactionIdList = ideaTransactionIdRepository.findAll();
        assertThat(ideaTransactionIdList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchIdeaTransactionId() throws Exception {
        int databaseSizeBeforeUpdate = ideaTransactionIdRepository.findAll().size();
        ideaTransactionId.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIdeaTransactionIdMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(ideaTransactionId))
            )
            .andExpect(status().isBadRequest());

        // Validate the IdeaTransactionId in the database
        List<IdeaTransactionId> ideaTransactionIdList = ideaTransactionIdRepository.findAll();
        assertThat(ideaTransactionIdList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamIdeaTransactionId() throws Exception {
        int databaseSizeBeforeUpdate = ideaTransactionIdRepository.findAll().size();
        ideaTransactionId.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIdeaTransactionIdMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(ideaTransactionId))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the IdeaTransactionId in the database
        List<IdeaTransactionId> ideaTransactionIdList = ideaTransactionIdRepository.findAll();
        assertThat(ideaTransactionIdList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteIdeaTransactionId() throws Exception {
        // Initialize the database
        ideaTransactionIdRepository.saveAndFlush(ideaTransactionId);

        int databaseSizeBeforeDelete = ideaTransactionIdRepository.findAll().size();

        // Delete the ideaTransactionId
        restIdeaTransactionIdMockMvc
            .perform(delete(ENTITY_API_URL_ID, ideaTransactionId.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<IdeaTransactionId> ideaTransactionIdList = ideaTransactionIdRepository.findAll();
        assertThat(ideaTransactionIdList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
