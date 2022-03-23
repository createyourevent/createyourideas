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
import net.createyourideas.app.domain.Feedback;
import net.createyourideas.app.repository.FeedbackRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link FeedbackResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class FeedbackResourceIT {

    private static final LocalDate DEFAULT_CREATION_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_CREATION_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final String DEFAULT_FEEDBACK = "AAAAAAAAAA";
    private static final String UPDATED_FEEDBACK = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/feedbacks";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restFeedbackMockMvc;

    private Feedback feedback;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Feedback createEntity(EntityManager em) {
        Feedback feedback = new Feedback()
            .creationDate(DEFAULT_CREATION_DATE)
            .name(DEFAULT_NAME)
            .email(DEFAULT_EMAIL)
            .feedback(DEFAULT_FEEDBACK);
        return feedback;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Feedback createUpdatedEntity(EntityManager em) {
        Feedback feedback = new Feedback()
            .creationDate(UPDATED_CREATION_DATE)
            .name(UPDATED_NAME)
            .email(UPDATED_EMAIL)
            .feedback(UPDATED_FEEDBACK);
        return feedback;
    }

    @BeforeEach
    public void initTest() {
        feedback = createEntity(em);
    }

    @Test
    @Transactional
    void createFeedback() throws Exception {
        int databaseSizeBeforeCreate = feedbackRepository.findAll().size();
        // Create the Feedback
        restFeedbackMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(feedback))
            )
            .andExpect(status().isCreated());

        // Validate the Feedback in the database
        List<Feedback> feedbackList = feedbackRepository.findAll();
        assertThat(feedbackList).hasSize(databaseSizeBeforeCreate + 1);
        Feedback testFeedback = feedbackList.get(feedbackList.size() - 1);
        assertThat(testFeedback.getCreationDate()).isEqualTo(DEFAULT_CREATION_DATE);
        assertThat(testFeedback.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testFeedback.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testFeedback.getFeedback()).isEqualTo(DEFAULT_FEEDBACK);
    }

    @Test
    @Transactional
    void createFeedbackWithExistingId() throws Exception {
        // Create the Feedback with an existing ID
        feedback.setId(1L);

        int databaseSizeBeforeCreate = feedbackRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFeedbackMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(feedback))
            )
            .andExpect(status().isBadRequest());

        // Validate the Feedback in the database
        List<Feedback> feedbackList = feedbackRepository.findAll();
        assertThat(feedbackList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkCreationDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = feedbackRepository.findAll().size();
        // set the field null
        feedback.setCreationDate(null);

        // Create the Feedback, which fails.

        restFeedbackMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(feedback))
            )
            .andExpect(status().isBadRequest());

        List<Feedback> feedbackList = feedbackRepository.findAll();
        assertThat(feedbackList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = feedbackRepository.findAll().size();
        // set the field null
        feedback.setName(null);

        // Create the Feedback, which fails.

        restFeedbackMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(feedback))
            )
            .andExpect(status().isBadRequest());

        List<Feedback> feedbackList = feedbackRepository.findAll();
        assertThat(feedbackList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkEmailIsRequired() throws Exception {
        int databaseSizeBeforeTest = feedbackRepository.findAll().size();
        // set the field null
        feedback.setEmail(null);

        // Create the Feedback, which fails.

        restFeedbackMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(feedback))
            )
            .andExpect(status().isBadRequest());

        List<Feedback> feedbackList = feedbackRepository.findAll();
        assertThat(feedbackList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllFeedbacks() throws Exception {
        // Initialize the database
        feedbackRepository.saveAndFlush(feedback);

        // Get all the feedbackList
        restFeedbackMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(feedback.getId().intValue())))
            .andExpect(jsonPath("$.[*].creationDate").value(hasItem(DEFAULT_CREATION_DATE.toString())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].feedback").value(hasItem(DEFAULT_FEEDBACK.toString())));
    }

    @Test
    @Transactional
    void getFeedback() throws Exception {
        // Initialize the database
        feedbackRepository.saveAndFlush(feedback);

        // Get the feedback
        restFeedbackMockMvc
            .perform(get(ENTITY_API_URL_ID, feedback.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(feedback.getId().intValue()))
            .andExpect(jsonPath("$.creationDate").value(DEFAULT_CREATION_DATE.toString()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL))
            .andExpect(jsonPath("$.feedback").value(DEFAULT_FEEDBACK.toString()));
    }

    @Test
    @Transactional
    void getNonExistingFeedback() throws Exception {
        // Get the feedback
        restFeedbackMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewFeedback() throws Exception {
        // Initialize the database
        feedbackRepository.saveAndFlush(feedback);

        int databaseSizeBeforeUpdate = feedbackRepository.findAll().size();

        // Update the feedback
        Feedback updatedFeedback = feedbackRepository.findById(feedback.getId()).get();
        // Disconnect from session so that the updates on updatedFeedback are not directly saved in db
        em.detach(updatedFeedback);
        updatedFeedback.creationDate(UPDATED_CREATION_DATE).name(UPDATED_NAME).email(UPDATED_EMAIL).feedback(UPDATED_FEEDBACK);

        restFeedbackMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedFeedback.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedFeedback))
            )
            .andExpect(status().isOk());

        // Validate the Feedback in the database
        List<Feedback> feedbackList = feedbackRepository.findAll();
        assertThat(feedbackList).hasSize(databaseSizeBeforeUpdate);
        Feedback testFeedback = feedbackList.get(feedbackList.size() - 1);
        assertThat(testFeedback.getCreationDate()).isEqualTo(UPDATED_CREATION_DATE);
        assertThat(testFeedback.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testFeedback.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testFeedback.getFeedback()).isEqualTo(UPDATED_FEEDBACK);
    }

    @Test
    @Transactional
    void putNonExistingFeedback() throws Exception {
        int databaseSizeBeforeUpdate = feedbackRepository.findAll().size();
        feedback.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFeedbackMockMvc
            .perform(
                put(ENTITY_API_URL_ID, feedback.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(feedback))
            )
            .andExpect(status().isBadRequest());

        // Validate the Feedback in the database
        List<Feedback> feedbackList = feedbackRepository.findAll();
        assertThat(feedbackList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchFeedback() throws Exception {
        int databaseSizeBeforeUpdate = feedbackRepository.findAll().size();
        feedback.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFeedbackMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(feedback))
            )
            .andExpect(status().isBadRequest());

        // Validate the Feedback in the database
        List<Feedback> feedbackList = feedbackRepository.findAll();
        assertThat(feedbackList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamFeedback() throws Exception {
        int databaseSizeBeforeUpdate = feedbackRepository.findAll().size();
        feedback.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFeedbackMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(feedback))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Feedback in the database
        List<Feedback> feedbackList = feedbackRepository.findAll();
        assertThat(feedbackList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateFeedbackWithPatch() throws Exception {
        // Initialize the database
        feedbackRepository.saveAndFlush(feedback);

        int databaseSizeBeforeUpdate = feedbackRepository.findAll().size();

        // Update the feedback using partial update
        Feedback partialUpdatedFeedback = new Feedback();
        partialUpdatedFeedback.setId(feedback.getId());

        partialUpdatedFeedback.name(UPDATED_NAME);

        restFeedbackMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFeedback.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFeedback))
            )
            .andExpect(status().isOk());

        // Validate the Feedback in the database
        List<Feedback> feedbackList = feedbackRepository.findAll();
        assertThat(feedbackList).hasSize(databaseSizeBeforeUpdate);
        Feedback testFeedback = feedbackList.get(feedbackList.size() - 1);
        assertThat(testFeedback.getCreationDate()).isEqualTo(DEFAULT_CREATION_DATE);
        assertThat(testFeedback.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testFeedback.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testFeedback.getFeedback()).isEqualTo(DEFAULT_FEEDBACK);
    }

    @Test
    @Transactional
    void fullUpdateFeedbackWithPatch() throws Exception {
        // Initialize the database
        feedbackRepository.saveAndFlush(feedback);

        int databaseSizeBeforeUpdate = feedbackRepository.findAll().size();

        // Update the feedback using partial update
        Feedback partialUpdatedFeedback = new Feedback();
        partialUpdatedFeedback.setId(feedback.getId());

        partialUpdatedFeedback.creationDate(UPDATED_CREATION_DATE).name(UPDATED_NAME).email(UPDATED_EMAIL).feedback(UPDATED_FEEDBACK);

        restFeedbackMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFeedback.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFeedback))
            )
            .andExpect(status().isOk());

        // Validate the Feedback in the database
        List<Feedback> feedbackList = feedbackRepository.findAll();
        assertThat(feedbackList).hasSize(databaseSizeBeforeUpdate);
        Feedback testFeedback = feedbackList.get(feedbackList.size() - 1);
        assertThat(testFeedback.getCreationDate()).isEqualTo(UPDATED_CREATION_DATE);
        assertThat(testFeedback.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testFeedback.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testFeedback.getFeedback()).isEqualTo(UPDATED_FEEDBACK);
    }

    @Test
    @Transactional
    void patchNonExistingFeedback() throws Exception {
        int databaseSizeBeforeUpdate = feedbackRepository.findAll().size();
        feedback.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFeedbackMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, feedback.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(feedback))
            )
            .andExpect(status().isBadRequest());

        // Validate the Feedback in the database
        List<Feedback> feedbackList = feedbackRepository.findAll();
        assertThat(feedbackList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchFeedback() throws Exception {
        int databaseSizeBeforeUpdate = feedbackRepository.findAll().size();
        feedback.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFeedbackMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(feedback))
            )
            .andExpect(status().isBadRequest());

        // Validate the Feedback in the database
        List<Feedback> feedbackList = feedbackRepository.findAll();
        assertThat(feedbackList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamFeedback() throws Exception {
        int databaseSizeBeforeUpdate = feedbackRepository.findAll().size();
        feedback.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFeedbackMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(feedback))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Feedback in the database
        List<Feedback> feedbackList = feedbackRepository.findAll();
        assertThat(feedbackList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteFeedback() throws Exception {
        // Initialize the database
        feedbackRepository.saveAndFlush(feedback);

        int databaseSizeBeforeDelete = feedbackRepository.findAll().size();

        // Delete the feedback
        restFeedbackMockMvc
            .perform(delete(ENTITY_API_URL_ID, feedback.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Feedback> feedbackList = feedbackRepository.findAll();
        assertThat(feedbackList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
