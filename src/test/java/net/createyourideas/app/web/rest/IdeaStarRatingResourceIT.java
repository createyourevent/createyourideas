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
import net.createyourideas.app.domain.IdeaStarRating;
import net.createyourideas.app.repository.IdeaStarRatingRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link IdeaStarRatingResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class IdeaStarRatingResourceIT {

    private static final Integer DEFAULT_STARS = 1;
    private static final Integer UPDATED_STARS = 2;

    private static final ZonedDateTime DEFAULT_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_COMMENT = "AAAAAAAAAA";
    private static final String UPDATED_COMMENT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/idea-star-ratings";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private IdeaStarRatingRepository ideaStarRatingRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restIdeaStarRatingMockMvc;

    private IdeaStarRating ideaStarRating;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static IdeaStarRating createEntity(EntityManager em) {
        IdeaStarRating ideaStarRating = new IdeaStarRating().stars(DEFAULT_STARS).date(DEFAULT_DATE).comment(DEFAULT_COMMENT);
        return ideaStarRating;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static IdeaStarRating createUpdatedEntity(EntityManager em) {
        IdeaStarRating ideaStarRating = new IdeaStarRating().stars(UPDATED_STARS).date(UPDATED_DATE).comment(UPDATED_COMMENT);
        return ideaStarRating;
    }

    @BeforeEach
    public void initTest() {
        ideaStarRating = createEntity(em);
    }

    @Test
    @Transactional
    void createIdeaStarRating() throws Exception {
        int databaseSizeBeforeCreate = ideaStarRatingRepository.findAll().size();
        // Create the IdeaStarRating
        restIdeaStarRatingMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(ideaStarRating))
            )
            .andExpect(status().isCreated());

        // Validate the IdeaStarRating in the database
        List<IdeaStarRating> ideaStarRatingList = ideaStarRatingRepository.findAll();
        assertThat(ideaStarRatingList).hasSize(databaseSizeBeforeCreate + 1);
        IdeaStarRating testIdeaStarRating = ideaStarRatingList.get(ideaStarRatingList.size() - 1);
        assertThat(testIdeaStarRating.getStars()).isEqualTo(DEFAULT_STARS);
        assertThat(testIdeaStarRating.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testIdeaStarRating.getComment()).isEqualTo(DEFAULT_COMMENT);
    }

    @Test
    @Transactional
    void createIdeaStarRatingWithExistingId() throws Exception {
        // Create the IdeaStarRating with an existing ID
        ideaStarRating.setId(1L);

        int databaseSizeBeforeCreate = ideaStarRatingRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restIdeaStarRatingMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(ideaStarRating))
            )
            .andExpect(status().isBadRequest());

        // Validate the IdeaStarRating in the database
        List<IdeaStarRating> ideaStarRatingList = ideaStarRatingRepository.findAll();
        assertThat(ideaStarRatingList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllIdeaStarRatings() throws Exception {
        // Initialize the database
        ideaStarRatingRepository.saveAndFlush(ideaStarRating);

        // Get all the ideaStarRatingList
        restIdeaStarRatingMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(ideaStarRating.getId().intValue())))
            .andExpect(jsonPath("$.[*].stars").value(hasItem(DEFAULT_STARS)))
            .andExpect(jsonPath("$.[*].date").value(hasItem(sameInstant(DEFAULT_DATE))))
            .andExpect(jsonPath("$.[*].comment").value(hasItem(DEFAULT_COMMENT)));
    }

    @Test
    @Transactional
    void getIdeaStarRating() throws Exception {
        // Initialize the database
        ideaStarRatingRepository.saveAndFlush(ideaStarRating);

        // Get the ideaStarRating
        restIdeaStarRatingMockMvc
            .perform(get(ENTITY_API_URL_ID, ideaStarRating.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(ideaStarRating.getId().intValue()))
            .andExpect(jsonPath("$.stars").value(DEFAULT_STARS))
            .andExpect(jsonPath("$.date").value(sameInstant(DEFAULT_DATE)))
            .andExpect(jsonPath("$.comment").value(DEFAULT_COMMENT));
    }

    @Test
    @Transactional
    void getNonExistingIdeaStarRating() throws Exception {
        // Get the ideaStarRating
        restIdeaStarRatingMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewIdeaStarRating() throws Exception {
        // Initialize the database
        ideaStarRatingRepository.saveAndFlush(ideaStarRating);

        int databaseSizeBeforeUpdate = ideaStarRatingRepository.findAll().size();

        // Update the ideaStarRating
        IdeaStarRating updatedIdeaStarRating = ideaStarRatingRepository.findById(ideaStarRating.getId()).get();
        // Disconnect from session so that the updates on updatedIdeaStarRating are not directly saved in db
        em.detach(updatedIdeaStarRating);
        updatedIdeaStarRating.stars(UPDATED_STARS).date(UPDATED_DATE).comment(UPDATED_COMMENT);

        restIdeaStarRatingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedIdeaStarRating.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedIdeaStarRating))
            )
            .andExpect(status().isOk());

        // Validate the IdeaStarRating in the database
        List<IdeaStarRating> ideaStarRatingList = ideaStarRatingRepository.findAll();
        assertThat(ideaStarRatingList).hasSize(databaseSizeBeforeUpdate);
        IdeaStarRating testIdeaStarRating = ideaStarRatingList.get(ideaStarRatingList.size() - 1);
        assertThat(testIdeaStarRating.getStars()).isEqualTo(UPDATED_STARS);
        assertThat(testIdeaStarRating.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testIdeaStarRating.getComment()).isEqualTo(UPDATED_COMMENT);
    }

    @Test
    @Transactional
    void putNonExistingIdeaStarRating() throws Exception {
        int databaseSizeBeforeUpdate = ideaStarRatingRepository.findAll().size();
        ideaStarRating.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restIdeaStarRatingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, ideaStarRating.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(ideaStarRating))
            )
            .andExpect(status().isBadRequest());

        // Validate the IdeaStarRating in the database
        List<IdeaStarRating> ideaStarRatingList = ideaStarRatingRepository.findAll();
        assertThat(ideaStarRatingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchIdeaStarRating() throws Exception {
        int databaseSizeBeforeUpdate = ideaStarRatingRepository.findAll().size();
        ideaStarRating.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIdeaStarRatingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(ideaStarRating))
            )
            .andExpect(status().isBadRequest());

        // Validate the IdeaStarRating in the database
        List<IdeaStarRating> ideaStarRatingList = ideaStarRatingRepository.findAll();
        assertThat(ideaStarRatingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamIdeaStarRating() throws Exception {
        int databaseSizeBeforeUpdate = ideaStarRatingRepository.findAll().size();
        ideaStarRating.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIdeaStarRatingMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(ideaStarRating))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the IdeaStarRating in the database
        List<IdeaStarRating> ideaStarRatingList = ideaStarRatingRepository.findAll();
        assertThat(ideaStarRatingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateIdeaStarRatingWithPatch() throws Exception {
        // Initialize the database
        ideaStarRatingRepository.saveAndFlush(ideaStarRating);

        int databaseSizeBeforeUpdate = ideaStarRatingRepository.findAll().size();

        // Update the ideaStarRating using partial update
        IdeaStarRating partialUpdatedIdeaStarRating = new IdeaStarRating();
        partialUpdatedIdeaStarRating.setId(ideaStarRating.getId());

        restIdeaStarRatingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedIdeaStarRating.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedIdeaStarRating))
            )
            .andExpect(status().isOk());

        // Validate the IdeaStarRating in the database
        List<IdeaStarRating> ideaStarRatingList = ideaStarRatingRepository.findAll();
        assertThat(ideaStarRatingList).hasSize(databaseSizeBeforeUpdate);
        IdeaStarRating testIdeaStarRating = ideaStarRatingList.get(ideaStarRatingList.size() - 1);
        assertThat(testIdeaStarRating.getStars()).isEqualTo(DEFAULT_STARS);
        assertThat(testIdeaStarRating.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testIdeaStarRating.getComment()).isEqualTo(DEFAULT_COMMENT);
    }

    @Test
    @Transactional
    void fullUpdateIdeaStarRatingWithPatch() throws Exception {
        // Initialize the database
        ideaStarRatingRepository.saveAndFlush(ideaStarRating);

        int databaseSizeBeforeUpdate = ideaStarRatingRepository.findAll().size();

        // Update the ideaStarRating using partial update
        IdeaStarRating partialUpdatedIdeaStarRating = new IdeaStarRating();
        partialUpdatedIdeaStarRating.setId(ideaStarRating.getId());

        partialUpdatedIdeaStarRating.stars(UPDATED_STARS).date(UPDATED_DATE).comment(UPDATED_COMMENT);

        restIdeaStarRatingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedIdeaStarRating.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedIdeaStarRating))
            )
            .andExpect(status().isOk());

        // Validate the IdeaStarRating in the database
        List<IdeaStarRating> ideaStarRatingList = ideaStarRatingRepository.findAll();
        assertThat(ideaStarRatingList).hasSize(databaseSizeBeforeUpdate);
        IdeaStarRating testIdeaStarRating = ideaStarRatingList.get(ideaStarRatingList.size() - 1);
        assertThat(testIdeaStarRating.getStars()).isEqualTo(UPDATED_STARS);
        assertThat(testIdeaStarRating.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testIdeaStarRating.getComment()).isEqualTo(UPDATED_COMMENT);
    }

    @Test
    @Transactional
    void patchNonExistingIdeaStarRating() throws Exception {
        int databaseSizeBeforeUpdate = ideaStarRatingRepository.findAll().size();
        ideaStarRating.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restIdeaStarRatingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, ideaStarRating.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(ideaStarRating))
            )
            .andExpect(status().isBadRequest());

        // Validate the IdeaStarRating in the database
        List<IdeaStarRating> ideaStarRatingList = ideaStarRatingRepository.findAll();
        assertThat(ideaStarRatingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchIdeaStarRating() throws Exception {
        int databaseSizeBeforeUpdate = ideaStarRatingRepository.findAll().size();
        ideaStarRating.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIdeaStarRatingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(ideaStarRating))
            )
            .andExpect(status().isBadRequest());

        // Validate the IdeaStarRating in the database
        List<IdeaStarRating> ideaStarRatingList = ideaStarRatingRepository.findAll();
        assertThat(ideaStarRatingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamIdeaStarRating() throws Exception {
        int databaseSizeBeforeUpdate = ideaStarRatingRepository.findAll().size();
        ideaStarRating.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIdeaStarRatingMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(ideaStarRating))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the IdeaStarRating in the database
        List<IdeaStarRating> ideaStarRatingList = ideaStarRatingRepository.findAll();
        assertThat(ideaStarRatingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteIdeaStarRating() throws Exception {
        // Initialize the database
        ideaStarRatingRepository.saveAndFlush(ideaStarRating);

        int databaseSizeBeforeDelete = ideaStarRatingRepository.findAll().size();

        // Delete the ideaStarRating
        restIdeaStarRatingMockMvc
            .perform(delete(ENTITY_API_URL_ID, ideaStarRating.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<IdeaStarRating> ideaStarRatingList = ideaStarRatingRepository.findAll();
        assertThat(ideaStarRatingList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
