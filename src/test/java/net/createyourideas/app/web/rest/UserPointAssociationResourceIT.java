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
import net.createyourideas.app.domain.UserPointAssociation;
import net.createyourideas.app.repository.UserPointAssociationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link UserPointAssociationResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class UserPointAssociationResourceIT {

    private static final ZonedDateTime DEFAULT_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/user-point-associations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private UserPointAssociationRepository userPointAssociationRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restUserPointAssociationMockMvc;

    private UserPointAssociation userPointAssociation;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserPointAssociation createEntity(EntityManager em) {
        UserPointAssociation userPointAssociation = new UserPointAssociation().date(DEFAULT_DATE);
        return userPointAssociation;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserPointAssociation createUpdatedEntity(EntityManager em) {
        UserPointAssociation userPointAssociation = new UserPointAssociation().date(UPDATED_DATE);
        return userPointAssociation;
    }

    @BeforeEach
    public void initTest() {
        userPointAssociation = createEntity(em);
    }

    @Test
    @Transactional
    void createUserPointAssociation() throws Exception {
        int databaseSizeBeforeCreate = userPointAssociationRepository.findAll().size();
        // Create the UserPointAssociation
        restUserPointAssociationMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userPointAssociation))
            )
            .andExpect(status().isCreated());

        // Validate the UserPointAssociation in the database
        List<UserPointAssociation> userPointAssociationList = userPointAssociationRepository.findAll();
        assertThat(userPointAssociationList).hasSize(databaseSizeBeforeCreate + 1);
        UserPointAssociation testUserPointAssociation = userPointAssociationList.get(userPointAssociationList.size() - 1);
        assertThat(testUserPointAssociation.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    void createUserPointAssociationWithExistingId() throws Exception {
        // Create the UserPointAssociation with an existing ID
        userPointAssociation.setId(1L);

        int databaseSizeBeforeCreate = userPointAssociationRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restUserPointAssociationMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userPointAssociation))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserPointAssociation in the database
        List<UserPointAssociation> userPointAssociationList = userPointAssociationRepository.findAll();
        assertThat(userPointAssociationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllUserPointAssociations() throws Exception {
        // Initialize the database
        userPointAssociationRepository.saveAndFlush(userPointAssociation);

        // Get all the userPointAssociationList
        restUserPointAssociationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(userPointAssociation.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(sameInstant(DEFAULT_DATE))));
    }

    @Test
    @Transactional
    void getUserPointAssociation() throws Exception {
        // Initialize the database
        userPointAssociationRepository.saveAndFlush(userPointAssociation);

        // Get the userPointAssociation
        restUserPointAssociationMockMvc
            .perform(get(ENTITY_API_URL_ID, userPointAssociation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(userPointAssociation.getId().intValue()))
            .andExpect(jsonPath("$.date").value(sameInstant(DEFAULT_DATE)));
    }

    @Test
    @Transactional
    void getNonExistingUserPointAssociation() throws Exception {
        // Get the userPointAssociation
        restUserPointAssociationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewUserPointAssociation() throws Exception {
        // Initialize the database
        userPointAssociationRepository.saveAndFlush(userPointAssociation);

        int databaseSizeBeforeUpdate = userPointAssociationRepository.findAll().size();

        // Update the userPointAssociation
        UserPointAssociation updatedUserPointAssociation = userPointAssociationRepository.findById(userPointAssociation.getId()).get();
        // Disconnect from session so that the updates on updatedUserPointAssociation are not directly saved in db
        em.detach(updatedUserPointAssociation);
        updatedUserPointAssociation.date(UPDATED_DATE);

        restUserPointAssociationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedUserPointAssociation.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedUserPointAssociation))
            )
            .andExpect(status().isOk());

        // Validate the UserPointAssociation in the database
        List<UserPointAssociation> userPointAssociationList = userPointAssociationRepository.findAll();
        assertThat(userPointAssociationList).hasSize(databaseSizeBeforeUpdate);
        UserPointAssociation testUserPointAssociation = userPointAssociationList.get(userPointAssociationList.size() - 1);
        assertThat(testUserPointAssociation.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void putNonExistingUserPointAssociation() throws Exception {
        int databaseSizeBeforeUpdate = userPointAssociationRepository.findAll().size();
        userPointAssociation.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserPointAssociationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, userPointAssociation.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userPointAssociation))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserPointAssociation in the database
        List<UserPointAssociation> userPointAssociationList = userPointAssociationRepository.findAll();
        assertThat(userPointAssociationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchUserPointAssociation() throws Exception {
        int databaseSizeBeforeUpdate = userPointAssociationRepository.findAll().size();
        userPointAssociation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserPointAssociationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userPointAssociation))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserPointAssociation in the database
        List<UserPointAssociation> userPointAssociationList = userPointAssociationRepository.findAll();
        assertThat(userPointAssociationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamUserPointAssociation() throws Exception {
        int databaseSizeBeforeUpdate = userPointAssociationRepository.findAll().size();
        userPointAssociation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserPointAssociationMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userPointAssociation))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserPointAssociation in the database
        List<UserPointAssociation> userPointAssociationList = userPointAssociationRepository.findAll();
        assertThat(userPointAssociationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateUserPointAssociationWithPatch() throws Exception {
        // Initialize the database
        userPointAssociationRepository.saveAndFlush(userPointAssociation);

        int databaseSizeBeforeUpdate = userPointAssociationRepository.findAll().size();

        // Update the userPointAssociation using partial update
        UserPointAssociation partialUpdatedUserPointAssociation = new UserPointAssociation();
        partialUpdatedUserPointAssociation.setId(userPointAssociation.getId());

        restUserPointAssociationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserPointAssociation.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserPointAssociation))
            )
            .andExpect(status().isOk());

        // Validate the UserPointAssociation in the database
        List<UserPointAssociation> userPointAssociationList = userPointAssociationRepository.findAll();
        assertThat(userPointAssociationList).hasSize(databaseSizeBeforeUpdate);
        UserPointAssociation testUserPointAssociation = userPointAssociationList.get(userPointAssociationList.size() - 1);
        assertThat(testUserPointAssociation.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    void fullUpdateUserPointAssociationWithPatch() throws Exception {
        // Initialize the database
        userPointAssociationRepository.saveAndFlush(userPointAssociation);

        int databaseSizeBeforeUpdate = userPointAssociationRepository.findAll().size();

        // Update the userPointAssociation using partial update
        UserPointAssociation partialUpdatedUserPointAssociation = new UserPointAssociation();
        partialUpdatedUserPointAssociation.setId(userPointAssociation.getId());

        partialUpdatedUserPointAssociation.date(UPDATED_DATE);

        restUserPointAssociationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserPointAssociation.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserPointAssociation))
            )
            .andExpect(status().isOk());

        // Validate the UserPointAssociation in the database
        List<UserPointAssociation> userPointAssociationList = userPointAssociationRepository.findAll();
        assertThat(userPointAssociationList).hasSize(databaseSizeBeforeUpdate);
        UserPointAssociation testUserPointAssociation = userPointAssociationList.get(userPointAssociationList.size() - 1);
        assertThat(testUserPointAssociation.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingUserPointAssociation() throws Exception {
        int databaseSizeBeforeUpdate = userPointAssociationRepository.findAll().size();
        userPointAssociation.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserPointAssociationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, userPointAssociation.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userPointAssociation))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserPointAssociation in the database
        List<UserPointAssociation> userPointAssociationList = userPointAssociationRepository.findAll();
        assertThat(userPointAssociationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchUserPointAssociation() throws Exception {
        int databaseSizeBeforeUpdate = userPointAssociationRepository.findAll().size();
        userPointAssociation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserPointAssociationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userPointAssociation))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserPointAssociation in the database
        List<UserPointAssociation> userPointAssociationList = userPointAssociationRepository.findAll();
        assertThat(userPointAssociationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamUserPointAssociation() throws Exception {
        int databaseSizeBeforeUpdate = userPointAssociationRepository.findAll().size();
        userPointAssociation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserPointAssociationMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userPointAssociation))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserPointAssociation in the database
        List<UserPointAssociation> userPointAssociationList = userPointAssociationRepository.findAll();
        assertThat(userPointAssociationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteUserPointAssociation() throws Exception {
        // Initialize the database
        userPointAssociationRepository.saveAndFlush(userPointAssociation);

        int databaseSizeBeforeDelete = userPointAssociationRepository.findAll().size();

        // Delete the userPointAssociation
        restUserPointAssociationMockMvc
            .perform(delete(ENTITY_API_URL_ID, userPointAssociation.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<UserPointAssociation> userPointAssociationList = userPointAssociationRepository.findAll();
        assertThat(userPointAssociationList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
