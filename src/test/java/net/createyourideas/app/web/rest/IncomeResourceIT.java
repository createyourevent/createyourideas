package net.createyourideas.app.web.rest;

import static net.createyourideas.app.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import net.createyourideas.app.IntegrationTest;
import net.createyourideas.app.domain.Income;
import net.createyourideas.app.repository.IncomeRepository;
import net.createyourideas.app.service.IncomeService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link IncomeResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class IncomeResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final Float DEFAULT_VALUE = 1F;
    private static final Float UPDATED_VALUE = 2F;

    private static final Boolean DEFAULT_BILLED = false;
    private static final Boolean UPDATED_BILLED = true;

    private static final Boolean DEFAULT_FROM_PARENT_IDEA = false;
    private static final Boolean UPDATED_FROM_PARENT_IDEA = true;

    private static final Boolean DEFAULT_AUTO = false;
    private static final Boolean UPDATED_AUTO = true;

    private static final String ENTITY_API_URL = "/api/incomes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private IncomeRepository incomeRepository;

    @Mock
    private IncomeRepository incomeRepositoryMock;

    @Mock
    private IncomeService incomeServiceMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restIncomeMockMvc;

    private Income income;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Income createEntity(EntityManager em) {
        Income income = new Income()
            .title(DEFAULT_TITLE)
            .description(DEFAULT_DESCRIPTION)
            .date(DEFAULT_DATE)
            .value(DEFAULT_VALUE)
            .billed(DEFAULT_BILLED)
            .fromParentIdea(DEFAULT_FROM_PARENT_IDEA)
            .auto(DEFAULT_AUTO);
        return income;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Income createUpdatedEntity(EntityManager em) {
        Income income = new Income()
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION)
            .date(UPDATED_DATE)
            .value(UPDATED_VALUE)
            .billed(UPDATED_BILLED)
            .fromParentIdea(UPDATED_FROM_PARENT_IDEA)
            .auto(UPDATED_AUTO);
        return income;
    }

    @BeforeEach
    public void initTest() {
        income = createEntity(em);
    }

    @Test
    @Transactional
    void createIncome() throws Exception {
        int databaseSizeBeforeCreate = incomeRepository.findAll().size();
        // Create the Income
        restIncomeMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(income))
            )
            .andExpect(status().isCreated());

        // Validate the Income in the database
        List<Income> incomeList = incomeRepository.findAll();
        assertThat(incomeList).hasSize(databaseSizeBeforeCreate + 1);
        Income testIncome = incomeList.get(incomeList.size() - 1);
        assertThat(testIncome.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testIncome.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testIncome.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testIncome.getValue()).isEqualTo(DEFAULT_VALUE);
        assertThat(testIncome.getBilled()).isEqualTo(DEFAULT_BILLED);
        assertThat(testIncome.getFromParentIdea()).isEqualTo(DEFAULT_FROM_PARENT_IDEA);
        assertThat(testIncome.getAuto()).isEqualTo(DEFAULT_AUTO);
    }

    @Test
    @Transactional
    void createIncomeWithExistingId() throws Exception {
        // Create the Income with an existing ID
        income.setId(1L);

        int databaseSizeBeforeCreate = incomeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restIncomeMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(income))
            )
            .andExpect(status().isBadRequest());

        // Validate the Income in the database
        List<Income> incomeList = incomeRepository.findAll();
        assertThat(incomeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkTitleIsRequired() throws Exception {
        int databaseSizeBeforeTest = incomeRepository.findAll().size();
        // set the field null
        income.setTitle(null);

        // Create the Income, which fails.

        restIncomeMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(income))
            )
            .andExpect(status().isBadRequest());

        List<Income> incomeList = incomeRepository.findAll();
        assertThat(incomeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDescriptionIsRequired() throws Exception {
        int databaseSizeBeforeTest = incomeRepository.findAll().size();
        // set the field null
        income.setDescription(null);

        // Create the Income, which fails.

        restIncomeMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(income))
            )
            .andExpect(status().isBadRequest());

        List<Income> incomeList = incomeRepository.findAll();
        assertThat(incomeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = incomeRepository.findAll().size();
        // set the field null
        income.setDate(null);

        // Create the Income, which fails.

        restIncomeMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(income))
            )
            .andExpect(status().isBadRequest());

        List<Income> incomeList = incomeRepository.findAll();
        assertThat(incomeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkValueIsRequired() throws Exception {
        int databaseSizeBeforeTest = incomeRepository.findAll().size();
        // set the field null
        income.setValue(null);

        // Create the Income, which fails.

        restIncomeMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(income))
            )
            .andExpect(status().isBadRequest());

        List<Income> incomeList = incomeRepository.findAll();
        assertThat(incomeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllIncomes() throws Exception {
        // Initialize the database
        incomeRepository.saveAndFlush(income);

        // Get all the incomeList
        restIncomeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(income.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].date").value(hasItem(sameInstant(DEFAULT_DATE))))
            .andExpect(jsonPath("$.[*].value").value(hasItem(DEFAULT_VALUE.doubleValue())))
            .andExpect(jsonPath("$.[*].billed").value(hasItem(DEFAULT_BILLED.booleanValue())))
            .andExpect(jsonPath("$.[*].fromParentIdea").value(hasItem(DEFAULT_FROM_PARENT_IDEA.booleanValue())))
            .andExpect(jsonPath("$.[*].auto").value(hasItem(DEFAULT_AUTO.booleanValue())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllIncomesWithEagerRelationshipsIsEnabled() throws Exception {
        when(incomeServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restIncomeMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(incomeServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllIncomesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(incomeServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restIncomeMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(incomeServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    void getIncome() throws Exception {
        // Initialize the database
        incomeRepository.saveAndFlush(income);

        // Get the income
        restIncomeMockMvc
            .perform(get(ENTITY_API_URL_ID, income.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(income.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.date").value(sameInstant(DEFAULT_DATE)))
            .andExpect(jsonPath("$.value").value(DEFAULT_VALUE.doubleValue()))
            .andExpect(jsonPath("$.billed").value(DEFAULT_BILLED.booleanValue()))
            .andExpect(jsonPath("$.fromParentIdea").value(DEFAULT_FROM_PARENT_IDEA.booleanValue()))
            .andExpect(jsonPath("$.auto").value(DEFAULT_AUTO.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingIncome() throws Exception {
        // Get the income
        restIncomeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewIncome() throws Exception {
        // Initialize the database
        incomeRepository.saveAndFlush(income);

        int databaseSizeBeforeUpdate = incomeRepository.findAll().size();

        // Update the income
        Income updatedIncome = incomeRepository.findById(income.getId()).get();
        // Disconnect from session so that the updates on updatedIncome are not directly saved in db
        em.detach(updatedIncome);
        updatedIncome
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION)
            .date(UPDATED_DATE)
            .value(UPDATED_VALUE)
            .billed(UPDATED_BILLED)
            .fromParentIdea(UPDATED_FROM_PARENT_IDEA)
            .auto(UPDATED_AUTO);

        restIncomeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedIncome.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedIncome))
            )
            .andExpect(status().isOk());

        // Validate the Income in the database
        List<Income> incomeList = incomeRepository.findAll();
        assertThat(incomeList).hasSize(databaseSizeBeforeUpdate);
        Income testIncome = incomeList.get(incomeList.size() - 1);
        assertThat(testIncome.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testIncome.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testIncome.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testIncome.getValue()).isEqualTo(UPDATED_VALUE);
        assertThat(testIncome.getBilled()).isEqualTo(UPDATED_BILLED);
        assertThat(testIncome.getFromParentIdea()).isEqualTo(UPDATED_FROM_PARENT_IDEA);
        assertThat(testIncome.getAuto()).isEqualTo(UPDATED_AUTO);
    }

    @Test
    @Transactional
    void putNonExistingIncome() throws Exception {
        int databaseSizeBeforeUpdate = incomeRepository.findAll().size();
        income.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restIncomeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, income.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(income))
            )
            .andExpect(status().isBadRequest());

        // Validate the Income in the database
        List<Income> incomeList = incomeRepository.findAll();
        assertThat(incomeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchIncome() throws Exception {
        int databaseSizeBeforeUpdate = incomeRepository.findAll().size();
        income.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIncomeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(income))
            )
            .andExpect(status().isBadRequest());

        // Validate the Income in the database
        List<Income> incomeList = incomeRepository.findAll();
        assertThat(incomeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamIncome() throws Exception {
        int databaseSizeBeforeUpdate = incomeRepository.findAll().size();
        income.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIncomeMockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(income))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Income in the database
        List<Income> incomeList = incomeRepository.findAll();
        assertThat(incomeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateIncomeWithPatch() throws Exception {
        // Initialize the database
        incomeRepository.saveAndFlush(income);

        int databaseSizeBeforeUpdate = incomeRepository.findAll().size();

        // Update the income using partial update
        Income partialUpdatedIncome = new Income();
        partialUpdatedIncome.setId(income.getId());

        partialUpdatedIncome.description(UPDATED_DESCRIPTION).date(UPDATED_DATE);

        restIncomeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedIncome.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedIncome))
            )
            .andExpect(status().isOk());

        // Validate the Income in the database
        List<Income> incomeList = incomeRepository.findAll();
        assertThat(incomeList).hasSize(databaseSizeBeforeUpdate);
        Income testIncome = incomeList.get(incomeList.size() - 1);
        assertThat(testIncome.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testIncome.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testIncome.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testIncome.getValue()).isEqualTo(DEFAULT_VALUE);
        assertThat(testIncome.getBilled()).isEqualTo(DEFAULT_BILLED);
        assertThat(testIncome.getFromParentIdea()).isEqualTo(DEFAULT_FROM_PARENT_IDEA);
        assertThat(testIncome.getAuto()).isEqualTo(DEFAULT_AUTO);
    }

    @Test
    @Transactional
    void fullUpdateIncomeWithPatch() throws Exception {
        // Initialize the database
        incomeRepository.saveAndFlush(income);

        int databaseSizeBeforeUpdate = incomeRepository.findAll().size();

        // Update the income using partial update
        Income partialUpdatedIncome = new Income();
        partialUpdatedIncome.setId(income.getId());

        partialUpdatedIncome
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION)
            .date(UPDATED_DATE)
            .value(UPDATED_VALUE)
            .billed(UPDATED_BILLED)
            .fromParentIdea(UPDATED_FROM_PARENT_IDEA)
            .auto(UPDATED_AUTO);

        restIncomeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedIncome.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedIncome))
            )
            .andExpect(status().isOk());

        // Validate the Income in the database
        List<Income> incomeList = incomeRepository.findAll();
        assertThat(incomeList).hasSize(databaseSizeBeforeUpdate);
        Income testIncome = incomeList.get(incomeList.size() - 1);
        assertThat(testIncome.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testIncome.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testIncome.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testIncome.getValue()).isEqualTo(UPDATED_VALUE);
        assertThat(testIncome.getBilled()).isEqualTo(UPDATED_BILLED);
        assertThat(testIncome.getFromParentIdea()).isEqualTo(UPDATED_FROM_PARENT_IDEA);
        assertThat(testIncome.getAuto()).isEqualTo(UPDATED_AUTO);
    }

    @Test
    @Transactional
    void patchNonExistingIncome() throws Exception {
        int databaseSizeBeforeUpdate = incomeRepository.findAll().size();
        income.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restIncomeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, income.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(income))
            )
            .andExpect(status().isBadRequest());

        // Validate the Income in the database
        List<Income> incomeList = incomeRepository.findAll();
        assertThat(incomeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchIncome() throws Exception {
        int databaseSizeBeforeUpdate = incomeRepository.findAll().size();
        income.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIncomeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(income))
            )
            .andExpect(status().isBadRequest());

        // Validate the Income in the database
        List<Income> incomeList = incomeRepository.findAll();
        assertThat(incomeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamIncome() throws Exception {
        int databaseSizeBeforeUpdate = incomeRepository.findAll().size();
        income.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIncomeMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(income))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Income in the database
        List<Income> incomeList = incomeRepository.findAll();
        assertThat(incomeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteIncome() throws Exception {
        // Initialize the database
        incomeRepository.saveAndFlush(income);

        int databaseSizeBeforeDelete = incomeRepository.findAll().size();

        // Delete the income
        restIncomeMockMvc
            .perform(delete(ENTITY_API_URL_ID, income.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Income> incomeList = incomeRepository.findAll();
        assertThat(incomeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
