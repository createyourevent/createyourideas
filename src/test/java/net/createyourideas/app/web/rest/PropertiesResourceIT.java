package net.createyourideas.app.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import net.createyourideas.app.IntegrationTest;
import net.createyourideas.app.domain.Properties;
import net.createyourideas.app.repository.PropertiesRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link PropertiesResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PropertiesResourceIT {

    private static final String DEFAULT_KEY = "AAAAAAAAAA";
    private static final String UPDATED_KEY = "BBBBBBBBBB";

    private static final String DEFAULT_VALUE = "AAAAAAAAAA";
    private static final String UPDATED_VALUE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/properties";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PropertiesRepository propertiesRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPropertiesMockMvc;

    private Properties properties;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Properties createEntity(EntityManager em) {
        Properties properties = new Properties().key(DEFAULT_KEY).value(DEFAULT_VALUE);
        return properties;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Properties createUpdatedEntity(EntityManager em) {
        Properties properties = new Properties().key(UPDATED_KEY).value(UPDATED_VALUE);
        return properties;
    }

    @BeforeEach
    public void initTest() {
        properties = createEntity(em);
    }

    @Test
    @Transactional
    void createProperties() throws Exception {
        int databaseSizeBeforeCreate = propertiesRepository.findAll().size();
        // Create the Properties
        restPropertiesMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(properties))
            )
            .andExpect(status().isCreated());

        // Validate the Properties in the database
        List<Properties> propertiesList = propertiesRepository.findAll();
        assertThat(propertiesList).hasSize(databaseSizeBeforeCreate + 1);
        Properties testProperties = propertiesList.get(propertiesList.size() - 1);
        assertThat(testProperties.getKey()).isEqualTo(DEFAULT_KEY);
        assertThat(testProperties.getValue()).isEqualTo(DEFAULT_VALUE);
    }

    @Test
    @Transactional
    void createPropertiesWithExistingId() throws Exception {
        // Create the Properties with an existing ID
        properties.setId(1L);

        int databaseSizeBeforeCreate = propertiesRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPropertiesMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(properties))
            )
            .andExpect(status().isBadRequest());

        // Validate the Properties in the database
        List<Properties> propertiesList = propertiesRepository.findAll();
        assertThat(propertiesList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllProperties() throws Exception {
        // Initialize the database
        propertiesRepository.saveAndFlush(properties);

        // Get all the propertiesList
        restPropertiesMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(properties.getId().intValue())))
            .andExpect(jsonPath("$.[*].key").value(hasItem(DEFAULT_KEY)))
            .andExpect(jsonPath("$.[*].value").value(hasItem(DEFAULT_VALUE)));
    }

    @Test
    @Transactional
    void getProperties() throws Exception {
        // Initialize the database
        propertiesRepository.saveAndFlush(properties);

        // Get the properties
        restPropertiesMockMvc
            .perform(get(ENTITY_API_URL_ID, properties.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(properties.getId().intValue()))
            .andExpect(jsonPath("$.key").value(DEFAULT_KEY))
            .andExpect(jsonPath("$.value").value(DEFAULT_VALUE));
    }

    @Test
    @Transactional
    void getNonExistingProperties() throws Exception {
        // Get the properties
        restPropertiesMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewProperties() throws Exception {
        // Initialize the database
        propertiesRepository.saveAndFlush(properties);

        int databaseSizeBeforeUpdate = propertiesRepository.findAll().size();

        // Update the properties
        Properties updatedProperties = propertiesRepository.findById(properties.getId()).get();
        // Disconnect from session so that the updates on updatedProperties are not directly saved in db
        em.detach(updatedProperties);
        updatedProperties.key(UPDATED_KEY).value(UPDATED_VALUE);

        restPropertiesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedProperties.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedProperties))
            )
            .andExpect(status().isOk());

        // Validate the Properties in the database
        List<Properties> propertiesList = propertiesRepository.findAll();
        assertThat(propertiesList).hasSize(databaseSizeBeforeUpdate);
        Properties testProperties = propertiesList.get(propertiesList.size() - 1);
        assertThat(testProperties.getKey()).isEqualTo(UPDATED_KEY);
        assertThat(testProperties.getValue()).isEqualTo(UPDATED_VALUE);
    }

    @Test
    @Transactional
    void putNonExistingProperties() throws Exception {
        int databaseSizeBeforeUpdate = propertiesRepository.findAll().size();
        properties.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPropertiesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, properties.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(properties))
            )
            .andExpect(status().isBadRequest());

        // Validate the Properties in the database
        List<Properties> propertiesList = propertiesRepository.findAll();
        assertThat(propertiesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchProperties() throws Exception {
        int databaseSizeBeforeUpdate = propertiesRepository.findAll().size();
        properties.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPropertiesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(properties))
            )
            .andExpect(status().isBadRequest());

        // Validate the Properties in the database
        List<Properties> propertiesList = propertiesRepository.findAll();
        assertThat(propertiesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamProperties() throws Exception {
        int databaseSizeBeforeUpdate = propertiesRepository.findAll().size();
        properties.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPropertiesMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(properties))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Properties in the database
        List<Properties> propertiesList = propertiesRepository.findAll();
        assertThat(propertiesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePropertiesWithPatch() throws Exception {
        // Initialize the database
        propertiesRepository.saveAndFlush(properties);

        int databaseSizeBeforeUpdate = propertiesRepository.findAll().size();

        // Update the properties using partial update
        Properties partialUpdatedProperties = new Properties();
        partialUpdatedProperties.setId(properties.getId());

        restPropertiesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProperties.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProperties))
            )
            .andExpect(status().isOk());

        // Validate the Properties in the database
        List<Properties> propertiesList = propertiesRepository.findAll();
        assertThat(propertiesList).hasSize(databaseSizeBeforeUpdate);
        Properties testProperties = propertiesList.get(propertiesList.size() - 1);
        assertThat(testProperties.getKey()).isEqualTo(DEFAULT_KEY);
        assertThat(testProperties.getValue()).isEqualTo(DEFAULT_VALUE);
    }

    @Test
    @Transactional
    void fullUpdatePropertiesWithPatch() throws Exception {
        // Initialize the database
        propertiesRepository.saveAndFlush(properties);

        int databaseSizeBeforeUpdate = propertiesRepository.findAll().size();

        // Update the properties using partial update
        Properties partialUpdatedProperties = new Properties();
        partialUpdatedProperties.setId(properties.getId());

        partialUpdatedProperties.key(UPDATED_KEY).value(UPDATED_VALUE);

        restPropertiesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProperties.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProperties))
            )
            .andExpect(status().isOk());

        // Validate the Properties in the database
        List<Properties> propertiesList = propertiesRepository.findAll();
        assertThat(propertiesList).hasSize(databaseSizeBeforeUpdate);
        Properties testProperties = propertiesList.get(propertiesList.size() - 1);
        assertThat(testProperties.getKey()).isEqualTo(UPDATED_KEY);
        assertThat(testProperties.getValue()).isEqualTo(UPDATED_VALUE);
    }

    @Test
    @Transactional
    void patchNonExistingProperties() throws Exception {
        int databaseSizeBeforeUpdate = propertiesRepository.findAll().size();
        properties.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPropertiesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, properties.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(properties))
            )
            .andExpect(status().isBadRequest());

        // Validate the Properties in the database
        List<Properties> propertiesList = propertiesRepository.findAll();
        assertThat(propertiesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchProperties() throws Exception {
        int databaseSizeBeforeUpdate = propertiesRepository.findAll().size();
        properties.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPropertiesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(properties))
            )
            .andExpect(status().isBadRequest());

        // Validate the Properties in the database
        List<Properties> propertiesList = propertiesRepository.findAll();
        assertThat(propertiesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamProperties() throws Exception {
        int databaseSizeBeforeUpdate = propertiesRepository.findAll().size();
        properties.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPropertiesMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(properties))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Properties in the database
        List<Properties> propertiesList = propertiesRepository.findAll();
        assertThat(propertiesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteProperties() throws Exception {
        // Initialize the database
        propertiesRepository.saveAndFlush(properties);

        int databaseSizeBeforeDelete = propertiesRepository.findAll().size();

        // Delete the properties
        restPropertiesMockMvc
            .perform(delete(ENTITY_API_URL_ID, properties.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Properties> propertiesList = propertiesRepository.findAll();
        assertThat(propertiesList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
