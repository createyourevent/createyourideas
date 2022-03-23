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
import net.createyourideas.app.domain.Application;
import net.createyourideas.app.repository.ApplicationRepository;
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
 * Integration tests for the {@link ApplicationResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ApplicationResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final Float DEFAULT_DESIRED_HOURLY_WAGE = 1F;
    private static final Float UPDATED_DESIRED_HOURLY_WAGE = 2F;

    private static final Boolean DEFAULT_SEEN = false;
    private static final Boolean UPDATED_SEEN = true;

    private static final Boolean DEFAULT_RESPONDED = false;
    private static final Boolean UPDATED_RESPONDED = true;

    private static final String ENTITY_API_URL = "/api/applications";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restApplicationMockMvc;

    private Application application;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Application createEntity(EntityManager em) {
        Application application = new Application()
            .title(DEFAULT_TITLE)
            .description(DEFAULT_DESCRIPTION)
            .date(DEFAULT_DATE)
            .desiredHourlyWage(DEFAULT_DESIRED_HOURLY_WAGE)
            .seen(DEFAULT_SEEN)
            .responded(DEFAULT_RESPONDED);
        return application;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Application createUpdatedEntity(EntityManager em) {
        Application application = new Application()
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION)
            .date(UPDATED_DATE)
            .desiredHourlyWage(UPDATED_DESIRED_HOURLY_WAGE)
            .seen(UPDATED_SEEN)
            .responded(UPDATED_RESPONDED);
        return application;
    }

    @BeforeEach
    public void initTest() {
        application = createEntity(em);
    }

    @Test
    @Transactional
    void createApplication() throws Exception {
        int databaseSizeBeforeCreate = applicationRepository.findAll().size();
        // Create the Application
        restApplicationMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(application))
            )
            .andExpect(status().isCreated());

        // Validate the Application in the database
        List<Application> applicationList = applicationRepository.findAll();
        assertThat(applicationList).hasSize(databaseSizeBeforeCreate + 1);
        Application testApplication = applicationList.get(applicationList.size() - 1);
        assertThat(testApplication.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testApplication.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testApplication.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testApplication.getDesiredHourlyWage()).isEqualTo(DEFAULT_DESIRED_HOURLY_WAGE);
        assertThat(testApplication.getSeen()).isEqualTo(DEFAULT_SEEN);
        assertThat(testApplication.getResponded()).isEqualTo(DEFAULT_RESPONDED);
    }

    @Test
    @Transactional
    void createApplicationWithExistingId() throws Exception {
        // Create the Application with an existing ID
        application.setId(1L);

        int databaseSizeBeforeCreate = applicationRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restApplicationMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(application))
            )
            .andExpect(status().isBadRequest());

        // Validate the Application in the database
        List<Application> applicationList = applicationRepository.findAll();
        assertThat(applicationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllApplications() throws Exception {
        // Initialize the database
        applicationRepository.saveAndFlush(application);

        // Get all the applicationList
        restApplicationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(application.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(sameInstant(DEFAULT_DATE))))
            .andExpect(jsonPath("$.[*].desiredHourlyWage").value(hasItem(DEFAULT_DESIRED_HOURLY_WAGE.doubleValue())))
            .andExpect(jsonPath("$.[*].seen").value(hasItem(DEFAULT_SEEN.booleanValue())))
            .andExpect(jsonPath("$.[*].responded").value(hasItem(DEFAULT_RESPONDED.booleanValue())));
    }

    @Test
    @Transactional
    void getApplication() throws Exception {
        // Initialize the database
        applicationRepository.saveAndFlush(application);

        // Get the application
        restApplicationMockMvc
            .perform(get(ENTITY_API_URL_ID, application.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(application.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.date").value(sameInstant(DEFAULT_DATE)))
            .andExpect(jsonPath("$.desiredHourlyWage").value(DEFAULT_DESIRED_HOURLY_WAGE.doubleValue()))
            .andExpect(jsonPath("$.seen").value(DEFAULT_SEEN.booleanValue()))
            .andExpect(jsonPath("$.responded").value(DEFAULT_RESPONDED.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingApplication() throws Exception {
        // Get the application
        restApplicationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewApplication() throws Exception {
        // Initialize the database
        applicationRepository.saveAndFlush(application);

        int databaseSizeBeforeUpdate = applicationRepository.findAll().size();

        // Update the application
        Application updatedApplication = applicationRepository.findById(application.getId()).get();
        // Disconnect from session so that the updates on updatedApplication are not directly saved in db
        em.detach(updatedApplication);
        updatedApplication
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION)
            .date(UPDATED_DATE)
            .desiredHourlyWage(UPDATED_DESIRED_HOURLY_WAGE)
            .seen(UPDATED_SEEN)
            .responded(UPDATED_RESPONDED);

        restApplicationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedApplication.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedApplication))
            )
            .andExpect(status().isOk());

        // Validate the Application in the database
        List<Application> applicationList = applicationRepository.findAll();
        assertThat(applicationList).hasSize(databaseSizeBeforeUpdate);
        Application testApplication = applicationList.get(applicationList.size() - 1);
        assertThat(testApplication.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testApplication.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testApplication.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testApplication.getDesiredHourlyWage()).isEqualTo(UPDATED_DESIRED_HOURLY_WAGE);
        assertThat(testApplication.getSeen()).isEqualTo(UPDATED_SEEN);
        assertThat(testApplication.getResponded()).isEqualTo(UPDATED_RESPONDED);
    }

    @Test
    @Transactional
    void putNonExistingApplication() throws Exception {
        int databaseSizeBeforeUpdate = applicationRepository.findAll().size();
        application.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restApplicationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, application.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(application))
            )
            .andExpect(status().isBadRequest());

        // Validate the Application in the database
        List<Application> applicationList = applicationRepository.findAll();
        assertThat(applicationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchApplication() throws Exception {
        int databaseSizeBeforeUpdate = applicationRepository.findAll().size();
        application.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restApplicationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(application))
            )
            .andExpect(status().isBadRequest());

        // Validate the Application in the database
        List<Application> applicationList = applicationRepository.findAll();
        assertThat(applicationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamApplication() throws Exception {
        int databaseSizeBeforeUpdate = applicationRepository.findAll().size();
        application.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restApplicationMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(application))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Application in the database
        List<Application> applicationList = applicationRepository.findAll();
        assertThat(applicationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateApplicationWithPatch() throws Exception {
        // Initialize the database
        applicationRepository.saveAndFlush(application);

        int databaseSizeBeforeUpdate = applicationRepository.findAll().size();

        // Update the application using partial update
        Application partialUpdatedApplication = new Application();
        partialUpdatedApplication.setId(application.getId());

        partialUpdatedApplication.description(UPDATED_DESCRIPTION);

        restApplicationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedApplication.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedApplication))
            )
            .andExpect(status().isOk());

        // Validate the Application in the database
        List<Application> applicationList = applicationRepository.findAll();
        assertThat(applicationList).hasSize(databaseSizeBeforeUpdate);
        Application testApplication = applicationList.get(applicationList.size() - 1);
        assertThat(testApplication.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testApplication.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testApplication.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testApplication.getDesiredHourlyWage()).isEqualTo(DEFAULT_DESIRED_HOURLY_WAGE);
        assertThat(testApplication.getSeen()).isEqualTo(DEFAULT_SEEN);
        assertThat(testApplication.getResponded()).isEqualTo(DEFAULT_RESPONDED);
    }

    @Test
    @Transactional
    void fullUpdateApplicationWithPatch() throws Exception {
        // Initialize the database
        applicationRepository.saveAndFlush(application);

        int databaseSizeBeforeUpdate = applicationRepository.findAll().size();

        // Update the application using partial update
        Application partialUpdatedApplication = new Application();
        partialUpdatedApplication.setId(application.getId());

        partialUpdatedApplication
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION)
            .date(UPDATED_DATE)
            .desiredHourlyWage(UPDATED_DESIRED_HOURLY_WAGE)
            .seen(UPDATED_SEEN)
            .responded(UPDATED_RESPONDED);

        restApplicationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedApplication.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedApplication))
            )
            .andExpect(status().isOk());

        // Validate the Application in the database
        List<Application> applicationList = applicationRepository.findAll();
        assertThat(applicationList).hasSize(databaseSizeBeforeUpdate);
        Application testApplication = applicationList.get(applicationList.size() - 1);
        assertThat(testApplication.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testApplication.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testApplication.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testApplication.getDesiredHourlyWage()).isEqualTo(UPDATED_DESIRED_HOURLY_WAGE);
        assertThat(testApplication.getSeen()).isEqualTo(UPDATED_SEEN);
        assertThat(testApplication.getResponded()).isEqualTo(UPDATED_RESPONDED);
    }

    @Test
    @Transactional
    void patchNonExistingApplication() throws Exception {
        int databaseSizeBeforeUpdate = applicationRepository.findAll().size();
        application.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restApplicationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, application.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(application))
            )
            .andExpect(status().isBadRequest());

        // Validate the Application in the database
        List<Application> applicationList = applicationRepository.findAll();
        assertThat(applicationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchApplication() throws Exception {
        int databaseSizeBeforeUpdate = applicationRepository.findAll().size();
        application.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restApplicationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(application))
            )
            .andExpect(status().isBadRequest());

        // Validate the Application in the database
        List<Application> applicationList = applicationRepository.findAll();
        assertThat(applicationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamApplication() throws Exception {
        int databaseSizeBeforeUpdate = applicationRepository.findAll().size();
        application.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restApplicationMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(application))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Application in the database
        List<Application> applicationList = applicationRepository.findAll();
        assertThat(applicationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteApplication() throws Exception {
        // Initialize the database
        applicationRepository.saveAndFlush(application);

        int databaseSizeBeforeDelete = applicationRepository.findAll().size();

        // Delete the application
        restApplicationMockMvc
            .perform(delete(ENTITY_API_URL_ID, application.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Application> applicationList = applicationRepository.findAll();
        assertThat(applicationList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
