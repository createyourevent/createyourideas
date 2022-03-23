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
import net.createyourideas.app.domain.IdeaLikeDislike;
import net.createyourideas.app.repository.IdeaLikeDislikeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link IdeaLikeDislikeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class IdeaLikeDislikeResourceIT {

    private static final Integer DEFAULT_LIKE = 1;
    private static final Integer UPDATED_LIKE = 2;

    private static final Integer DEFAULT_DISLIKE = 1;
    private static final Integer UPDATED_DISLIKE = 2;

    private static final ZonedDateTime DEFAULT_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_COMMENT = "AAAAAAAAAA";
    private static final String UPDATED_COMMENT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/idea-like-dislikes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private IdeaLikeDislikeRepository ideaLikeDislikeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restIdeaLikeDislikeMockMvc;

    private IdeaLikeDislike ideaLikeDislike;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static IdeaLikeDislike createEntity(EntityManager em) {
        IdeaLikeDislike ideaLikeDislike = new IdeaLikeDislike()
            .like(DEFAULT_LIKE)
            .dislike(DEFAULT_DISLIKE)
            .date(DEFAULT_DATE)
            .comment(DEFAULT_COMMENT);
        return ideaLikeDislike;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static IdeaLikeDislike createUpdatedEntity(EntityManager em) {
        IdeaLikeDislike ideaLikeDislike = new IdeaLikeDislike()
            .like(UPDATED_LIKE)
            .dislike(UPDATED_DISLIKE)
            .date(UPDATED_DATE)
            .comment(UPDATED_COMMENT);
        return ideaLikeDislike;
    }

    @BeforeEach
    public void initTest() {
        ideaLikeDislike = createEntity(em);
    }

    @Test
    @Transactional
    void createIdeaLikeDislike() throws Exception {
        int databaseSizeBeforeCreate = ideaLikeDislikeRepository.findAll().size();
        // Create the IdeaLikeDislike
        restIdeaLikeDislikeMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(ideaLikeDislike))
            )
            .andExpect(status().isCreated());

        // Validate the IdeaLikeDislike in the database
        List<IdeaLikeDislike> ideaLikeDislikeList = ideaLikeDislikeRepository.findAll();
        assertThat(ideaLikeDislikeList).hasSize(databaseSizeBeforeCreate + 1);
        IdeaLikeDislike testIdeaLikeDislike = ideaLikeDislikeList.get(ideaLikeDislikeList.size() - 1);
        assertThat(testIdeaLikeDislike.getLike()).isEqualTo(DEFAULT_LIKE);
        assertThat(testIdeaLikeDislike.getDislike()).isEqualTo(DEFAULT_DISLIKE);
        assertThat(testIdeaLikeDislike.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testIdeaLikeDislike.getComment()).isEqualTo(DEFAULT_COMMENT);
    }

    @Test
    @Transactional
    void createIdeaLikeDislikeWithExistingId() throws Exception {
        // Create the IdeaLikeDislike with an existing ID
        ideaLikeDislike.setId(1L);

        int databaseSizeBeforeCreate = ideaLikeDislikeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restIdeaLikeDislikeMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(ideaLikeDislike))
            )
            .andExpect(status().isBadRequest());

        // Validate the IdeaLikeDislike in the database
        List<IdeaLikeDislike> ideaLikeDislikeList = ideaLikeDislikeRepository.findAll();
        assertThat(ideaLikeDislikeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllIdeaLikeDislikes() throws Exception {
        // Initialize the database
        ideaLikeDislikeRepository.saveAndFlush(ideaLikeDislike);

        // Get all the ideaLikeDislikeList
        restIdeaLikeDislikeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(ideaLikeDislike.getId().intValue())))
            .andExpect(jsonPath("$.[*].like").value(hasItem(DEFAULT_LIKE)))
            .andExpect(jsonPath("$.[*].dislike").value(hasItem(DEFAULT_DISLIKE)))
            .andExpect(jsonPath("$.[*].date").value(hasItem(sameInstant(DEFAULT_DATE))))
            .andExpect(jsonPath("$.[*].comment").value(hasItem(DEFAULT_COMMENT)));
    }

    @Test
    @Transactional
    void getIdeaLikeDislike() throws Exception {
        // Initialize the database
        ideaLikeDislikeRepository.saveAndFlush(ideaLikeDislike);

        // Get the ideaLikeDislike
        restIdeaLikeDislikeMockMvc
            .perform(get(ENTITY_API_URL_ID, ideaLikeDislike.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(ideaLikeDislike.getId().intValue()))
            .andExpect(jsonPath("$.like").value(DEFAULT_LIKE))
            .andExpect(jsonPath("$.dislike").value(DEFAULT_DISLIKE))
            .andExpect(jsonPath("$.date").value(sameInstant(DEFAULT_DATE)))
            .andExpect(jsonPath("$.comment").value(DEFAULT_COMMENT));
    }

    @Test
    @Transactional
    void getNonExistingIdeaLikeDislike() throws Exception {
        // Get the ideaLikeDislike
        restIdeaLikeDislikeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewIdeaLikeDislike() throws Exception {
        // Initialize the database
        ideaLikeDislikeRepository.saveAndFlush(ideaLikeDislike);

        int databaseSizeBeforeUpdate = ideaLikeDislikeRepository.findAll().size();

        // Update the ideaLikeDislike
        IdeaLikeDislike updatedIdeaLikeDislike = ideaLikeDislikeRepository.findById(ideaLikeDislike.getId()).get();
        // Disconnect from session so that the updates on updatedIdeaLikeDislike are not directly saved in db
        em.detach(updatedIdeaLikeDislike);
        updatedIdeaLikeDislike.like(UPDATED_LIKE).dislike(UPDATED_DISLIKE).date(UPDATED_DATE).comment(UPDATED_COMMENT);

        restIdeaLikeDislikeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedIdeaLikeDislike.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedIdeaLikeDislike))
            )
            .andExpect(status().isOk());

        // Validate the IdeaLikeDislike in the database
        List<IdeaLikeDislike> ideaLikeDislikeList = ideaLikeDislikeRepository.findAll();
        assertThat(ideaLikeDislikeList).hasSize(databaseSizeBeforeUpdate);
        IdeaLikeDislike testIdeaLikeDislike = ideaLikeDislikeList.get(ideaLikeDislikeList.size() - 1);
        assertThat(testIdeaLikeDislike.getLike()).isEqualTo(UPDATED_LIKE);
        assertThat(testIdeaLikeDislike.getDislike()).isEqualTo(UPDATED_DISLIKE);
        assertThat(testIdeaLikeDislike.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testIdeaLikeDislike.getComment()).isEqualTo(UPDATED_COMMENT);
    }

    @Test
    @Transactional
    void putNonExistingIdeaLikeDislike() throws Exception {
        int databaseSizeBeforeUpdate = ideaLikeDislikeRepository.findAll().size();
        ideaLikeDislike.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restIdeaLikeDislikeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, ideaLikeDislike.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(ideaLikeDislike))
            )
            .andExpect(status().isBadRequest());

        // Validate the IdeaLikeDislike in the database
        List<IdeaLikeDislike> ideaLikeDislikeList = ideaLikeDislikeRepository.findAll();
        assertThat(ideaLikeDislikeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchIdeaLikeDislike() throws Exception {
        int databaseSizeBeforeUpdate = ideaLikeDislikeRepository.findAll().size();
        ideaLikeDislike.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIdeaLikeDislikeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(ideaLikeDislike))
            )
            .andExpect(status().isBadRequest());

        // Validate the IdeaLikeDislike in the database
        List<IdeaLikeDislike> ideaLikeDislikeList = ideaLikeDislikeRepository.findAll();
        assertThat(ideaLikeDislikeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamIdeaLikeDislike() throws Exception {
        int databaseSizeBeforeUpdate = ideaLikeDislikeRepository.findAll().size();
        ideaLikeDislike.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIdeaLikeDislikeMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(ideaLikeDislike))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the IdeaLikeDislike in the database
        List<IdeaLikeDislike> ideaLikeDislikeList = ideaLikeDislikeRepository.findAll();
        assertThat(ideaLikeDislikeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateIdeaLikeDislikeWithPatch() throws Exception {
        // Initialize the database
        ideaLikeDislikeRepository.saveAndFlush(ideaLikeDislike);

        int databaseSizeBeforeUpdate = ideaLikeDislikeRepository.findAll().size();

        // Update the ideaLikeDislike using partial update
        IdeaLikeDislike partialUpdatedIdeaLikeDislike = new IdeaLikeDislike();
        partialUpdatedIdeaLikeDislike.setId(ideaLikeDislike.getId());

        partialUpdatedIdeaLikeDislike.dislike(UPDATED_DISLIKE).date(UPDATED_DATE);

        restIdeaLikeDislikeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedIdeaLikeDislike.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedIdeaLikeDislike))
            )
            .andExpect(status().isOk());

        // Validate the IdeaLikeDislike in the database
        List<IdeaLikeDislike> ideaLikeDislikeList = ideaLikeDislikeRepository.findAll();
        assertThat(ideaLikeDislikeList).hasSize(databaseSizeBeforeUpdate);
        IdeaLikeDislike testIdeaLikeDislike = ideaLikeDislikeList.get(ideaLikeDislikeList.size() - 1);
        assertThat(testIdeaLikeDislike.getLike()).isEqualTo(DEFAULT_LIKE);
        assertThat(testIdeaLikeDislike.getDislike()).isEqualTo(UPDATED_DISLIKE);
        assertThat(testIdeaLikeDislike.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testIdeaLikeDislike.getComment()).isEqualTo(DEFAULT_COMMENT);
    }

    @Test
    @Transactional
    void fullUpdateIdeaLikeDislikeWithPatch() throws Exception {
        // Initialize the database
        ideaLikeDislikeRepository.saveAndFlush(ideaLikeDislike);

        int databaseSizeBeforeUpdate = ideaLikeDislikeRepository.findAll().size();

        // Update the ideaLikeDislike using partial update
        IdeaLikeDislike partialUpdatedIdeaLikeDislike = new IdeaLikeDislike();
        partialUpdatedIdeaLikeDislike.setId(ideaLikeDislike.getId());

        partialUpdatedIdeaLikeDislike.like(UPDATED_LIKE).dislike(UPDATED_DISLIKE).date(UPDATED_DATE).comment(UPDATED_COMMENT);

        restIdeaLikeDislikeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedIdeaLikeDislike.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedIdeaLikeDislike))
            )
            .andExpect(status().isOk());

        // Validate the IdeaLikeDislike in the database
        List<IdeaLikeDislike> ideaLikeDislikeList = ideaLikeDislikeRepository.findAll();
        assertThat(ideaLikeDislikeList).hasSize(databaseSizeBeforeUpdate);
        IdeaLikeDislike testIdeaLikeDislike = ideaLikeDislikeList.get(ideaLikeDislikeList.size() - 1);
        assertThat(testIdeaLikeDislike.getLike()).isEqualTo(UPDATED_LIKE);
        assertThat(testIdeaLikeDislike.getDislike()).isEqualTo(UPDATED_DISLIKE);
        assertThat(testIdeaLikeDislike.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testIdeaLikeDislike.getComment()).isEqualTo(UPDATED_COMMENT);
    }

    @Test
    @Transactional
    void patchNonExistingIdeaLikeDislike() throws Exception {
        int databaseSizeBeforeUpdate = ideaLikeDislikeRepository.findAll().size();
        ideaLikeDislike.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restIdeaLikeDislikeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, ideaLikeDislike.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(ideaLikeDislike))
            )
            .andExpect(status().isBadRequest());

        // Validate the IdeaLikeDislike in the database
        List<IdeaLikeDislike> ideaLikeDislikeList = ideaLikeDislikeRepository.findAll();
        assertThat(ideaLikeDislikeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchIdeaLikeDislike() throws Exception {
        int databaseSizeBeforeUpdate = ideaLikeDislikeRepository.findAll().size();
        ideaLikeDislike.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIdeaLikeDislikeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(ideaLikeDislike))
            )
            .andExpect(status().isBadRequest());

        // Validate the IdeaLikeDislike in the database
        List<IdeaLikeDislike> ideaLikeDislikeList = ideaLikeDislikeRepository.findAll();
        assertThat(ideaLikeDislikeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamIdeaLikeDislike() throws Exception {
        int databaseSizeBeforeUpdate = ideaLikeDislikeRepository.findAll().size();
        ideaLikeDislike.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIdeaLikeDislikeMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(ideaLikeDislike))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the IdeaLikeDislike in the database
        List<IdeaLikeDislike> ideaLikeDislikeList = ideaLikeDislikeRepository.findAll();
        assertThat(ideaLikeDislikeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteIdeaLikeDislike() throws Exception {
        // Initialize the database
        ideaLikeDislikeRepository.saveAndFlush(ideaLikeDislike);

        int databaseSizeBeforeDelete = ideaLikeDislikeRepository.findAll().size();

        // Delete the ideaLikeDislike
        restIdeaLikeDislikeMockMvc
            .perform(delete(ENTITY_API_URL_ID, ideaLikeDislike.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<IdeaLikeDislike> ideaLikeDislikeList = ideaLikeDislikeRepository.findAll();
        assertThat(ideaLikeDislikeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
