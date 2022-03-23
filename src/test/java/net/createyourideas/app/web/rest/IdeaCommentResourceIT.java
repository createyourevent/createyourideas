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
import net.createyourideas.app.domain.IdeaComment;
import net.createyourideas.app.repository.IdeaCommentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link IdeaCommentResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class IdeaCommentResourceIT {

    private static final String DEFAULT_COMMENT = "AAAAAAAAAA";
    private static final String UPDATED_COMMENT = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/idea-comments";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private IdeaCommentRepository ideaCommentRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restIdeaCommentMockMvc;

    private IdeaComment ideaComment;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static IdeaComment createEntity(EntityManager em) {
        IdeaComment ideaComment = new IdeaComment().comment(DEFAULT_COMMENT).date(DEFAULT_DATE);
        return ideaComment;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static IdeaComment createUpdatedEntity(EntityManager em) {
        IdeaComment ideaComment = new IdeaComment().comment(UPDATED_COMMENT).date(UPDATED_DATE);
        return ideaComment;
    }

    @BeforeEach
    public void initTest() {
        ideaComment = createEntity(em);
    }

    @Test
    @Transactional
    void createIdeaComment() throws Exception {
        int databaseSizeBeforeCreate = ideaCommentRepository.findAll().size();
        // Create the IdeaComment
        restIdeaCommentMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(ideaComment))
            )
            .andExpect(status().isCreated());

        // Validate the IdeaComment in the database
        List<IdeaComment> ideaCommentList = ideaCommentRepository.findAll();
        assertThat(ideaCommentList).hasSize(databaseSizeBeforeCreate + 1);
        IdeaComment testIdeaComment = ideaCommentList.get(ideaCommentList.size() - 1);
        assertThat(testIdeaComment.getComment()).isEqualTo(DEFAULT_COMMENT);
        assertThat(testIdeaComment.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    void createIdeaCommentWithExistingId() throws Exception {
        // Create the IdeaComment with an existing ID
        ideaComment.setId(1L);

        int databaseSizeBeforeCreate = ideaCommentRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restIdeaCommentMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(ideaComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the IdeaComment in the database
        List<IdeaComment> ideaCommentList = ideaCommentRepository.findAll();
        assertThat(ideaCommentList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllIdeaComments() throws Exception {
        // Initialize the database
        ideaCommentRepository.saveAndFlush(ideaComment);

        // Get all the ideaCommentList
        restIdeaCommentMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(ideaComment.getId().intValue())))
            .andExpect(jsonPath("$.[*].comment").value(hasItem(DEFAULT_COMMENT)))
            .andExpect(jsonPath("$.[*].date").value(hasItem(sameInstant(DEFAULT_DATE))));
    }

    @Test
    @Transactional
    void getIdeaComment() throws Exception {
        // Initialize the database
        ideaCommentRepository.saveAndFlush(ideaComment);

        // Get the ideaComment
        restIdeaCommentMockMvc
            .perform(get(ENTITY_API_URL_ID, ideaComment.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(ideaComment.getId().intValue()))
            .andExpect(jsonPath("$.comment").value(DEFAULT_COMMENT))
            .andExpect(jsonPath("$.date").value(sameInstant(DEFAULT_DATE)));
    }

    @Test
    @Transactional
    void getNonExistingIdeaComment() throws Exception {
        // Get the ideaComment
        restIdeaCommentMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewIdeaComment() throws Exception {
        // Initialize the database
        ideaCommentRepository.saveAndFlush(ideaComment);

        int databaseSizeBeforeUpdate = ideaCommentRepository.findAll().size();

        // Update the ideaComment
        IdeaComment updatedIdeaComment = ideaCommentRepository.findById(ideaComment.getId()).get();
        // Disconnect from session so that the updates on updatedIdeaComment are not directly saved in db
        em.detach(updatedIdeaComment);
        updatedIdeaComment.comment(UPDATED_COMMENT).date(UPDATED_DATE);

        restIdeaCommentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedIdeaComment.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedIdeaComment))
            )
            .andExpect(status().isOk());

        // Validate the IdeaComment in the database
        List<IdeaComment> ideaCommentList = ideaCommentRepository.findAll();
        assertThat(ideaCommentList).hasSize(databaseSizeBeforeUpdate);
        IdeaComment testIdeaComment = ideaCommentList.get(ideaCommentList.size() - 1);
        assertThat(testIdeaComment.getComment()).isEqualTo(UPDATED_COMMENT);
        assertThat(testIdeaComment.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void putNonExistingIdeaComment() throws Exception {
        int databaseSizeBeforeUpdate = ideaCommentRepository.findAll().size();
        ideaComment.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restIdeaCommentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, ideaComment.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(ideaComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the IdeaComment in the database
        List<IdeaComment> ideaCommentList = ideaCommentRepository.findAll();
        assertThat(ideaCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchIdeaComment() throws Exception {
        int databaseSizeBeforeUpdate = ideaCommentRepository.findAll().size();
        ideaComment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIdeaCommentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(ideaComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the IdeaComment in the database
        List<IdeaComment> ideaCommentList = ideaCommentRepository.findAll();
        assertThat(ideaCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamIdeaComment() throws Exception {
        int databaseSizeBeforeUpdate = ideaCommentRepository.findAll().size();
        ideaComment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIdeaCommentMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(ideaComment))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the IdeaComment in the database
        List<IdeaComment> ideaCommentList = ideaCommentRepository.findAll();
        assertThat(ideaCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateIdeaCommentWithPatch() throws Exception {
        // Initialize the database
        ideaCommentRepository.saveAndFlush(ideaComment);

        int databaseSizeBeforeUpdate = ideaCommentRepository.findAll().size();

        // Update the ideaComment using partial update
        IdeaComment partialUpdatedIdeaComment = new IdeaComment();
        partialUpdatedIdeaComment.setId(ideaComment.getId());

        restIdeaCommentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedIdeaComment.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedIdeaComment))
            )
            .andExpect(status().isOk());

        // Validate the IdeaComment in the database
        List<IdeaComment> ideaCommentList = ideaCommentRepository.findAll();
        assertThat(ideaCommentList).hasSize(databaseSizeBeforeUpdate);
        IdeaComment testIdeaComment = ideaCommentList.get(ideaCommentList.size() - 1);
        assertThat(testIdeaComment.getComment()).isEqualTo(DEFAULT_COMMENT);
        assertThat(testIdeaComment.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    void fullUpdateIdeaCommentWithPatch() throws Exception {
        // Initialize the database
        ideaCommentRepository.saveAndFlush(ideaComment);

        int databaseSizeBeforeUpdate = ideaCommentRepository.findAll().size();

        // Update the ideaComment using partial update
        IdeaComment partialUpdatedIdeaComment = new IdeaComment();
        partialUpdatedIdeaComment.setId(ideaComment.getId());

        partialUpdatedIdeaComment.comment(UPDATED_COMMENT).date(UPDATED_DATE);

        restIdeaCommentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedIdeaComment.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedIdeaComment))
            )
            .andExpect(status().isOk());

        // Validate the IdeaComment in the database
        List<IdeaComment> ideaCommentList = ideaCommentRepository.findAll();
        assertThat(ideaCommentList).hasSize(databaseSizeBeforeUpdate);
        IdeaComment testIdeaComment = ideaCommentList.get(ideaCommentList.size() - 1);
        assertThat(testIdeaComment.getComment()).isEqualTo(UPDATED_COMMENT);
        assertThat(testIdeaComment.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingIdeaComment() throws Exception {
        int databaseSizeBeforeUpdate = ideaCommentRepository.findAll().size();
        ideaComment.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restIdeaCommentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, ideaComment.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(ideaComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the IdeaComment in the database
        List<IdeaComment> ideaCommentList = ideaCommentRepository.findAll();
        assertThat(ideaCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchIdeaComment() throws Exception {
        int databaseSizeBeforeUpdate = ideaCommentRepository.findAll().size();
        ideaComment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIdeaCommentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(ideaComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the IdeaComment in the database
        List<IdeaComment> ideaCommentList = ideaCommentRepository.findAll();
        assertThat(ideaCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamIdeaComment() throws Exception {
        int databaseSizeBeforeUpdate = ideaCommentRepository.findAll().size();
        ideaComment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIdeaCommentMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(ideaComment))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the IdeaComment in the database
        List<IdeaComment> ideaCommentList = ideaCommentRepository.findAll();
        assertThat(ideaCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteIdeaComment() throws Exception {
        // Initialize the database
        ideaCommentRepository.saveAndFlush(ideaComment);

        int databaseSizeBeforeDelete = ideaCommentRepository.findAll().size();

        // Delete the ideaComment
        restIdeaCommentMockMvc
            .perform(delete(ENTITY_API_URL_ID, ideaComment.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<IdeaComment> ideaCommentList = ideaCommentRepository.findAll();
        assertThat(ideaCommentList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
