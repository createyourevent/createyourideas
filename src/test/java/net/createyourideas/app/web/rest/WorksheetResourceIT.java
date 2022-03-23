package net.createyourideas.app.web.rest;

import static net.createyourideas.app.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import net.createyourideas.app.IntegrationTest;
import net.createyourideas.app.domain.Worksheet;
import net.createyourideas.app.repository.WorksheetRepository;
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
 * Integration tests for the {@link WorksheetResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class WorksheetResourceIT {

    private static final String DEFAULT_JOBTITLE = "AAAAAAAAAA";
    private static final String UPDATED_JOBTITLE = "BBBBBBBBBB";

    private static final String DEFAULT_JOBDESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_JOBDESCRIPTION = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_DATE_START = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE_START = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_DATE_END = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE_END = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final Float DEFAULT_COST_HOUR = 1F;
    private static final Float UPDATED_COST_HOUR = 2F;

    private static final Duration DEFAULT_HOURS = Duration.ofHours(6);
    private static final Duration UPDATED_HOURS = Duration.ofHours(12);

    private static final Float DEFAULT_TOTAL = 1F;
    private static final Float UPDATED_TOTAL = 2F;

    private static final Boolean DEFAULT_BILLED = false;
    private static final Boolean UPDATED_BILLED = true;

    private static final Boolean DEFAULT_AUTO = false;
    private static final Boolean UPDATED_AUTO = true;

    private static final String ENTITY_API_URL = "/api/worksheets";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private WorksheetRepository worksheetRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restWorksheetMockMvc;

    private Worksheet worksheet;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Worksheet createEntity(EntityManager em) {
        Worksheet worksheet = new Worksheet()
            .jobtitle(DEFAULT_JOBTITLE)
            .jobdescription(DEFAULT_JOBDESCRIPTION)
            .dateStart(DEFAULT_DATE_START)
            .dateEnd(DEFAULT_DATE_END)
            .costHour(DEFAULT_COST_HOUR)
            .hours(DEFAULT_HOURS)
            .total(DEFAULT_TOTAL)
            .billed(DEFAULT_BILLED)
            .auto(DEFAULT_AUTO);
        return worksheet;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Worksheet createUpdatedEntity(EntityManager em) {
        Worksheet worksheet = new Worksheet()
            .jobtitle(UPDATED_JOBTITLE)
            .jobdescription(UPDATED_JOBDESCRIPTION)
            .dateStart(UPDATED_DATE_START)
            .dateEnd(UPDATED_DATE_END)
            .costHour(UPDATED_COST_HOUR)
            .hours(UPDATED_HOURS)
            .total(UPDATED_TOTAL)
            .billed(UPDATED_BILLED)
            .auto(UPDATED_AUTO);
        return worksheet;
    }

    @BeforeEach
    public void initTest() {
        worksheet = createEntity(em);
    }

    @Test
    @Transactional
    void createWorksheet() throws Exception {
        int databaseSizeBeforeCreate = worksheetRepository.findAll().size();
        // Create the Worksheet
        restWorksheetMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(worksheet))
            )
            .andExpect(status().isCreated());

        // Validate the Worksheet in the database
        List<Worksheet> worksheetList = worksheetRepository.findAll();
        assertThat(worksheetList).hasSize(databaseSizeBeforeCreate + 1);
        Worksheet testWorksheet = worksheetList.get(worksheetList.size() - 1);
        assertThat(testWorksheet.getJobtitle()).isEqualTo(DEFAULT_JOBTITLE);
        assertThat(testWorksheet.getJobdescription()).isEqualTo(DEFAULT_JOBDESCRIPTION);
        assertThat(testWorksheet.getDateStart()).isEqualTo(DEFAULT_DATE_START);
        assertThat(testWorksheet.getDateEnd()).isEqualTo(DEFAULT_DATE_END);
        assertThat(testWorksheet.getCostHour()).isEqualTo(DEFAULT_COST_HOUR);
        assertThat(testWorksheet.getHours()).isEqualTo(DEFAULT_HOURS);
        assertThat(testWorksheet.getTotal()).isEqualTo(DEFAULT_TOTAL);
        assertThat(testWorksheet.getBilled()).isEqualTo(DEFAULT_BILLED);
        assertThat(testWorksheet.getAuto()).isEqualTo(DEFAULT_AUTO);
    }

    @Test
    @Transactional
    void createWorksheetWithExistingId() throws Exception {
        // Create the Worksheet with an existing ID
        worksheet.setId(1L);

        int databaseSizeBeforeCreate = worksheetRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restWorksheetMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(worksheet))
            )
            .andExpect(status().isBadRequest());

        // Validate the Worksheet in the database
        List<Worksheet> worksheetList = worksheetRepository.findAll();
        assertThat(worksheetList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkJobtitleIsRequired() throws Exception {
        int databaseSizeBeforeTest = worksheetRepository.findAll().size();
        // set the field null
        worksheet.setJobtitle(null);

        // Create the Worksheet, which fails.

        restWorksheetMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(worksheet))
            )
            .andExpect(status().isBadRequest());

        List<Worksheet> worksheetList = worksheetRepository.findAll();
        assertThat(worksheetList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkCostHourIsRequired() throws Exception {
        int databaseSizeBeforeTest = worksheetRepository.findAll().size();
        // set the field null
        worksheet.setCostHour(null);

        // Create the Worksheet, which fails.

        restWorksheetMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(worksheet))
            )
            .andExpect(status().isBadRequest());

        List<Worksheet> worksheetList = worksheetRepository.findAll();
        assertThat(worksheetList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllWorksheets() throws Exception {
        // Initialize the database
        worksheetRepository.saveAndFlush(worksheet);

        // Get all the worksheetList
        restWorksheetMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(worksheet.getId().intValue())))
            .andExpect(jsonPath("$.[*].jobtitle").value(hasItem(DEFAULT_JOBTITLE)))
            .andExpect(jsonPath("$.[*].jobdescription").value(hasItem(DEFAULT_JOBDESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].dateStart").value(hasItem(sameInstant(DEFAULT_DATE_START))))
            .andExpect(jsonPath("$.[*].dateEnd").value(hasItem(sameInstant(DEFAULT_DATE_END))))
            .andExpect(jsonPath("$.[*].costHour").value(hasItem(DEFAULT_COST_HOUR.doubleValue())))
            .andExpect(jsonPath("$.[*].hours").value(hasItem(DEFAULT_HOURS.toString())))
            .andExpect(jsonPath("$.[*].total").value(hasItem(DEFAULT_TOTAL.doubleValue())))
            .andExpect(jsonPath("$.[*].billed").value(hasItem(DEFAULT_BILLED.booleanValue())))
            .andExpect(jsonPath("$.[*].auto").value(hasItem(DEFAULT_AUTO.booleanValue())));
    }

    @Test
    @Transactional
    void getWorksheet() throws Exception {
        // Initialize the database
        worksheetRepository.saveAndFlush(worksheet);

        // Get the worksheet
        restWorksheetMockMvc
            .perform(get(ENTITY_API_URL_ID, worksheet.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(worksheet.getId().intValue()))
            .andExpect(jsonPath("$.jobtitle").value(DEFAULT_JOBTITLE))
            .andExpect(jsonPath("$.jobdescription").value(DEFAULT_JOBDESCRIPTION.toString()))
            .andExpect(jsonPath("$.dateStart").value(sameInstant(DEFAULT_DATE_START)))
            .andExpect(jsonPath("$.dateEnd").value(sameInstant(DEFAULT_DATE_END)))
            .andExpect(jsonPath("$.costHour").value(DEFAULT_COST_HOUR.doubleValue()))
            .andExpect(jsonPath("$.hours").value(DEFAULT_HOURS.toString()))
            .andExpect(jsonPath("$.total").value(DEFAULT_TOTAL.doubleValue()))
            .andExpect(jsonPath("$.billed").value(DEFAULT_BILLED.booleanValue()))
            .andExpect(jsonPath("$.auto").value(DEFAULT_AUTO.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingWorksheet() throws Exception {
        // Get the worksheet
        restWorksheetMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewWorksheet() throws Exception {
        // Initialize the database
        worksheetRepository.saveAndFlush(worksheet);

        int databaseSizeBeforeUpdate = worksheetRepository.findAll().size();

        // Update the worksheet
        Worksheet updatedWorksheet = worksheetRepository.findById(worksheet.getId()).get();
        // Disconnect from session so that the updates on updatedWorksheet are not directly saved in db
        em.detach(updatedWorksheet);
        updatedWorksheet
            .jobtitle(UPDATED_JOBTITLE)
            .jobdescription(UPDATED_JOBDESCRIPTION)
            .dateStart(UPDATED_DATE_START)
            .dateEnd(UPDATED_DATE_END)
            .costHour(UPDATED_COST_HOUR)
            .hours(UPDATED_HOURS)
            .total(UPDATED_TOTAL)
            .billed(UPDATED_BILLED)
            .auto(UPDATED_AUTO);

        restWorksheetMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedWorksheet.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedWorksheet))
            )
            .andExpect(status().isOk());

        // Validate the Worksheet in the database
        List<Worksheet> worksheetList = worksheetRepository.findAll();
        assertThat(worksheetList).hasSize(databaseSizeBeforeUpdate);
        Worksheet testWorksheet = worksheetList.get(worksheetList.size() - 1);
        assertThat(testWorksheet.getJobtitle()).isEqualTo(UPDATED_JOBTITLE);
        assertThat(testWorksheet.getJobdescription()).isEqualTo(UPDATED_JOBDESCRIPTION);
        assertThat(testWorksheet.getDateStart()).isEqualTo(UPDATED_DATE_START);
        assertThat(testWorksheet.getDateEnd()).isEqualTo(UPDATED_DATE_END);
        assertThat(testWorksheet.getCostHour()).isEqualTo(UPDATED_COST_HOUR);
        assertThat(testWorksheet.getHours()).isEqualTo(UPDATED_HOURS);
        assertThat(testWorksheet.getTotal()).isEqualTo(UPDATED_TOTAL);
        assertThat(testWorksheet.getBilled()).isEqualTo(UPDATED_BILLED);
        assertThat(testWorksheet.getAuto()).isEqualTo(UPDATED_AUTO);
    }

    @Test
    @Transactional
    void putNonExistingWorksheet() throws Exception {
        int databaseSizeBeforeUpdate = worksheetRepository.findAll().size();
        worksheet.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restWorksheetMockMvc
            .perform(
                put(ENTITY_API_URL_ID, worksheet.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(worksheet))
            )
            .andExpect(status().isBadRequest());

        // Validate the Worksheet in the database
        List<Worksheet> worksheetList = worksheetRepository.findAll();
        assertThat(worksheetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchWorksheet() throws Exception {
        int databaseSizeBeforeUpdate = worksheetRepository.findAll().size();
        worksheet.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWorksheetMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(worksheet))
            )
            .andExpect(status().isBadRequest());

        // Validate the Worksheet in the database
        List<Worksheet> worksheetList = worksheetRepository.findAll();
        assertThat(worksheetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamWorksheet() throws Exception {
        int databaseSizeBeforeUpdate = worksheetRepository.findAll().size();
        worksheet.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWorksheetMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(worksheet))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Worksheet in the database
        List<Worksheet> worksheetList = worksheetRepository.findAll();
        assertThat(worksheetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateWorksheetWithPatch() throws Exception {
        // Initialize the database
        worksheetRepository.saveAndFlush(worksheet);

        int databaseSizeBeforeUpdate = worksheetRepository.findAll().size();

        // Update the worksheet using partial update
        Worksheet partialUpdatedWorksheet = new Worksheet();
        partialUpdatedWorksheet.setId(worksheet.getId());

        partialUpdatedWorksheet
            .jobdescription(UPDATED_JOBDESCRIPTION)
            .costHour(UPDATED_COST_HOUR)
            .total(UPDATED_TOTAL)
            .billed(UPDATED_BILLED);

        restWorksheetMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedWorksheet.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedWorksheet))
            )
            .andExpect(status().isOk());

        // Validate the Worksheet in the database
        List<Worksheet> worksheetList = worksheetRepository.findAll();
        assertThat(worksheetList).hasSize(databaseSizeBeforeUpdate);
        Worksheet testWorksheet = worksheetList.get(worksheetList.size() - 1);
        assertThat(testWorksheet.getJobtitle()).isEqualTo(DEFAULT_JOBTITLE);
        assertThat(testWorksheet.getJobdescription()).isEqualTo(UPDATED_JOBDESCRIPTION);
        assertThat(testWorksheet.getDateStart()).isEqualTo(DEFAULT_DATE_START);
        assertThat(testWorksheet.getDateEnd()).isEqualTo(DEFAULT_DATE_END);
        assertThat(testWorksheet.getCostHour()).isEqualTo(UPDATED_COST_HOUR);
        assertThat(testWorksheet.getHours()).isEqualTo(DEFAULT_HOURS);
        assertThat(testWorksheet.getTotal()).isEqualTo(UPDATED_TOTAL);
        assertThat(testWorksheet.getBilled()).isEqualTo(UPDATED_BILLED);
        assertThat(testWorksheet.getAuto()).isEqualTo(DEFAULT_AUTO);
    }

    @Test
    @Transactional
    void fullUpdateWorksheetWithPatch() throws Exception {
        // Initialize the database
        worksheetRepository.saveAndFlush(worksheet);

        int databaseSizeBeforeUpdate = worksheetRepository.findAll().size();

        // Update the worksheet using partial update
        Worksheet partialUpdatedWorksheet = new Worksheet();
        partialUpdatedWorksheet.setId(worksheet.getId());

        partialUpdatedWorksheet
            .jobtitle(UPDATED_JOBTITLE)
            .jobdescription(UPDATED_JOBDESCRIPTION)
            .dateStart(UPDATED_DATE_START)
            .dateEnd(UPDATED_DATE_END)
            .costHour(UPDATED_COST_HOUR)
            .hours(UPDATED_HOURS)
            .total(UPDATED_TOTAL)
            .billed(UPDATED_BILLED)
            .auto(UPDATED_AUTO);

        restWorksheetMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedWorksheet.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedWorksheet))
            )
            .andExpect(status().isOk());

        // Validate the Worksheet in the database
        List<Worksheet> worksheetList = worksheetRepository.findAll();
        assertThat(worksheetList).hasSize(databaseSizeBeforeUpdate);
        Worksheet testWorksheet = worksheetList.get(worksheetList.size() - 1);
        assertThat(testWorksheet.getJobtitle()).isEqualTo(UPDATED_JOBTITLE);
        assertThat(testWorksheet.getJobdescription()).isEqualTo(UPDATED_JOBDESCRIPTION);
        assertThat(testWorksheet.getDateStart()).isEqualTo(UPDATED_DATE_START);
        assertThat(testWorksheet.getDateEnd()).isEqualTo(UPDATED_DATE_END);
        assertThat(testWorksheet.getCostHour()).isEqualTo(UPDATED_COST_HOUR);
        assertThat(testWorksheet.getHours()).isEqualTo(UPDATED_HOURS);
        assertThat(testWorksheet.getTotal()).isEqualTo(UPDATED_TOTAL);
        assertThat(testWorksheet.getBilled()).isEqualTo(UPDATED_BILLED);
        assertThat(testWorksheet.getAuto()).isEqualTo(UPDATED_AUTO);
    }

    @Test
    @Transactional
    void patchNonExistingWorksheet() throws Exception {
        int databaseSizeBeforeUpdate = worksheetRepository.findAll().size();
        worksheet.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restWorksheetMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, worksheet.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(worksheet))
            )
            .andExpect(status().isBadRequest());

        // Validate the Worksheet in the database
        List<Worksheet> worksheetList = worksheetRepository.findAll();
        assertThat(worksheetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchWorksheet() throws Exception {
        int databaseSizeBeforeUpdate = worksheetRepository.findAll().size();
        worksheet.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWorksheetMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(worksheet))
            )
            .andExpect(status().isBadRequest());

        // Validate the Worksheet in the database
        List<Worksheet> worksheetList = worksheetRepository.findAll();
        assertThat(worksheetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamWorksheet() throws Exception {
        int databaseSizeBeforeUpdate = worksheetRepository.findAll().size();
        worksheet.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWorksheetMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(worksheet))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Worksheet in the database
        List<Worksheet> worksheetList = worksheetRepository.findAll();
        assertThat(worksheetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteWorksheet() throws Exception {
        // Initialize the database
        worksheetRepository.saveAndFlush(worksheet);

        int databaseSizeBeforeDelete = worksheetRepository.findAll().size();

        // Delete the worksheet
        restWorksheetMockMvc
            .perform(delete(ENTITY_API_URL_ID, worksheet.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Worksheet> worksheetList = worksheetRepository.findAll();
        assertThat(worksheetList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
