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
import net.createyourideas.app.domain.Outgoings;
import net.createyourideas.app.repository.OutgoingsRepository;
import net.createyourideas.app.service.OutgoingsService;
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
 * Integration tests for the {@link OutgoingsResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class OutgoingsResourceIT {

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

    private static final Boolean DEFAULT_TO_CHILD_IDEA = false;
    private static final Boolean UPDATED_TO_CHILD_IDEA = true;

    private static final Boolean DEFAULT_AUTO = false;
    private static final Boolean UPDATED_AUTO = true;

    private static final String ENTITY_API_URL = "/api/outgoings";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private OutgoingsRepository outgoingsRepository;

    @Mock
    private OutgoingsRepository outgoingsRepositoryMock;

    @Mock
    private OutgoingsService outgoingsServiceMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restOutgoingsMockMvc;

    private Outgoings outgoings;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Outgoings createEntity(EntityManager em) {
        Outgoings outgoings = new Outgoings()
            .title(DEFAULT_TITLE)
            .description(DEFAULT_DESCRIPTION)
            .date(DEFAULT_DATE)
            .value(DEFAULT_VALUE)
            .billed(DEFAULT_BILLED)
            .toChildIdea(DEFAULT_TO_CHILD_IDEA)
            .auto(DEFAULT_AUTO);
        return outgoings;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Outgoings createUpdatedEntity(EntityManager em) {
        Outgoings outgoings = new Outgoings()
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION)
            .date(UPDATED_DATE)
            .value(UPDATED_VALUE)
            .billed(UPDATED_BILLED)
            .toChildIdea(UPDATED_TO_CHILD_IDEA)
            .auto(UPDATED_AUTO);
        return outgoings;
    }

    @BeforeEach
    public void initTest() {
        outgoings = createEntity(em);
    }

    @Test
    @Transactional
    void createOutgoings() throws Exception {
        int databaseSizeBeforeCreate = outgoingsRepository.findAll().size();
        // Create the Outgoings
        restOutgoingsMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(outgoings))
            )
            .andExpect(status().isCreated());

        // Validate the Outgoings in the database
        List<Outgoings> outgoingsList = outgoingsRepository.findAll();
        assertThat(outgoingsList).hasSize(databaseSizeBeforeCreate + 1);
        Outgoings testOutgoings = outgoingsList.get(outgoingsList.size() - 1);
        assertThat(testOutgoings.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testOutgoings.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testOutgoings.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testOutgoings.getValue()).isEqualTo(DEFAULT_VALUE);
        assertThat(testOutgoings.getBilled()).isEqualTo(DEFAULT_BILLED);
        assertThat(testOutgoings.getToChildIdea()).isEqualTo(DEFAULT_TO_CHILD_IDEA);
        assertThat(testOutgoings.getAuto()).isEqualTo(DEFAULT_AUTO);
    }

    @Test
    @Transactional
    void createOutgoingsWithExistingId() throws Exception {
        // Create the Outgoings with an existing ID
        outgoings.setId(1L);

        int databaseSizeBeforeCreate = outgoingsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restOutgoingsMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(outgoings))
            )
            .andExpect(status().isBadRequest());

        // Validate the Outgoings in the database
        List<Outgoings> outgoingsList = outgoingsRepository.findAll();
        assertThat(outgoingsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkTitleIsRequired() throws Exception {
        int databaseSizeBeforeTest = outgoingsRepository.findAll().size();
        // set the field null
        outgoings.setTitle(null);

        // Create the Outgoings, which fails.

        restOutgoingsMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(outgoings))
            )
            .andExpect(status().isBadRequest());

        List<Outgoings> outgoingsList = outgoingsRepository.findAll();
        assertThat(outgoingsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDescriptionIsRequired() throws Exception {
        int databaseSizeBeforeTest = outgoingsRepository.findAll().size();
        // set the field null
        outgoings.setDescription(null);

        // Create the Outgoings, which fails.

        restOutgoingsMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(outgoings))
            )
            .andExpect(status().isBadRequest());

        List<Outgoings> outgoingsList = outgoingsRepository.findAll();
        assertThat(outgoingsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = outgoingsRepository.findAll().size();
        // set the field null
        outgoings.setDate(null);

        // Create the Outgoings, which fails.

        restOutgoingsMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(outgoings))
            )
            .andExpect(status().isBadRequest());

        List<Outgoings> outgoingsList = outgoingsRepository.findAll();
        assertThat(outgoingsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkValueIsRequired() throws Exception {
        int databaseSizeBeforeTest = outgoingsRepository.findAll().size();
        // set the field null
        outgoings.setValue(null);

        // Create the Outgoings, which fails.

        restOutgoingsMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(outgoings))
            )
            .andExpect(status().isBadRequest());

        List<Outgoings> outgoingsList = outgoingsRepository.findAll();
        assertThat(outgoingsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllOutgoings() throws Exception {
        // Initialize the database
        outgoingsRepository.saveAndFlush(outgoings);

        // Get all the outgoingsList
        restOutgoingsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(outgoings.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].date").value(hasItem(sameInstant(DEFAULT_DATE))))
            .andExpect(jsonPath("$.[*].value").value(hasItem(DEFAULT_VALUE.doubleValue())))
            .andExpect(jsonPath("$.[*].billed").value(hasItem(DEFAULT_BILLED.booleanValue())))
            .andExpect(jsonPath("$.[*].toChildIdea").value(hasItem(DEFAULT_TO_CHILD_IDEA.booleanValue())))
            .andExpect(jsonPath("$.[*].auto").value(hasItem(DEFAULT_AUTO.booleanValue())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllOutgoingsWithEagerRelationshipsIsEnabled() throws Exception {
        when(outgoingsServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restOutgoingsMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(outgoingsServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllOutgoingsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(outgoingsServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restOutgoingsMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(outgoingsServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    void getOutgoings() throws Exception {
        // Initialize the database
        outgoingsRepository.saveAndFlush(outgoings);

        // Get the outgoings
        restOutgoingsMockMvc
            .perform(get(ENTITY_API_URL_ID, outgoings.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(outgoings.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.date").value(sameInstant(DEFAULT_DATE)))
            .andExpect(jsonPath("$.value").value(DEFAULT_VALUE.doubleValue()))
            .andExpect(jsonPath("$.billed").value(DEFAULT_BILLED.booleanValue()))
            .andExpect(jsonPath("$.toChildIdea").value(DEFAULT_TO_CHILD_IDEA.booleanValue()))
            .andExpect(jsonPath("$.auto").value(DEFAULT_AUTO.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingOutgoings() throws Exception {
        // Get the outgoings
        restOutgoingsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewOutgoings() throws Exception {
        // Initialize the database
        outgoingsRepository.saveAndFlush(outgoings);

        int databaseSizeBeforeUpdate = outgoingsRepository.findAll().size();

        // Update the outgoings
        Outgoings updatedOutgoings = outgoingsRepository.findById(outgoings.getId()).get();
        // Disconnect from session so that the updates on updatedOutgoings are not directly saved in db
        em.detach(updatedOutgoings);
        updatedOutgoings
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION)
            .date(UPDATED_DATE)
            .value(UPDATED_VALUE)
            .billed(UPDATED_BILLED)
            .toChildIdea(UPDATED_TO_CHILD_IDEA)
            .auto(UPDATED_AUTO);

        restOutgoingsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedOutgoings.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedOutgoings))
            )
            .andExpect(status().isOk());

        // Validate the Outgoings in the database
        List<Outgoings> outgoingsList = outgoingsRepository.findAll();
        assertThat(outgoingsList).hasSize(databaseSizeBeforeUpdate);
        Outgoings testOutgoings = outgoingsList.get(outgoingsList.size() - 1);
        assertThat(testOutgoings.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testOutgoings.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testOutgoings.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testOutgoings.getValue()).isEqualTo(UPDATED_VALUE);
        assertThat(testOutgoings.getBilled()).isEqualTo(UPDATED_BILLED);
        assertThat(testOutgoings.getToChildIdea()).isEqualTo(UPDATED_TO_CHILD_IDEA);
        assertThat(testOutgoings.getAuto()).isEqualTo(UPDATED_AUTO);
    }

    @Test
    @Transactional
    void putNonExistingOutgoings() throws Exception {
        int databaseSizeBeforeUpdate = outgoingsRepository.findAll().size();
        outgoings.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOutgoingsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, outgoings.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(outgoings))
            )
            .andExpect(status().isBadRequest());

        // Validate the Outgoings in the database
        List<Outgoings> outgoingsList = outgoingsRepository.findAll();
        assertThat(outgoingsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchOutgoings() throws Exception {
        int databaseSizeBeforeUpdate = outgoingsRepository.findAll().size();
        outgoings.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOutgoingsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(outgoings))
            )
            .andExpect(status().isBadRequest());

        // Validate the Outgoings in the database
        List<Outgoings> outgoingsList = outgoingsRepository.findAll();
        assertThat(outgoingsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamOutgoings() throws Exception {
        int databaseSizeBeforeUpdate = outgoingsRepository.findAll().size();
        outgoings.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOutgoingsMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(outgoings))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Outgoings in the database
        List<Outgoings> outgoingsList = outgoingsRepository.findAll();
        assertThat(outgoingsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateOutgoingsWithPatch() throws Exception {
        // Initialize the database
        outgoingsRepository.saveAndFlush(outgoings);

        int databaseSizeBeforeUpdate = outgoingsRepository.findAll().size();

        // Update the outgoings using partial update
        Outgoings partialUpdatedOutgoings = new Outgoings();
        partialUpdatedOutgoings.setId(outgoings.getId());

        partialUpdatedOutgoings
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION)
            .date(UPDATED_DATE)
            .billed(UPDATED_BILLED)
            .toChildIdea(UPDATED_TO_CHILD_IDEA);

        restOutgoingsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOutgoings.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOutgoings))
            )
            .andExpect(status().isOk());

        // Validate the Outgoings in the database
        List<Outgoings> outgoingsList = outgoingsRepository.findAll();
        assertThat(outgoingsList).hasSize(databaseSizeBeforeUpdate);
        Outgoings testOutgoings = outgoingsList.get(outgoingsList.size() - 1);
        assertThat(testOutgoings.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testOutgoings.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testOutgoings.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testOutgoings.getValue()).isEqualTo(DEFAULT_VALUE);
        assertThat(testOutgoings.getBilled()).isEqualTo(UPDATED_BILLED);
        assertThat(testOutgoings.getToChildIdea()).isEqualTo(UPDATED_TO_CHILD_IDEA);
        assertThat(testOutgoings.getAuto()).isEqualTo(DEFAULT_AUTO);
    }

    @Test
    @Transactional
    void fullUpdateOutgoingsWithPatch() throws Exception {
        // Initialize the database
        outgoingsRepository.saveAndFlush(outgoings);

        int databaseSizeBeforeUpdate = outgoingsRepository.findAll().size();

        // Update the outgoings using partial update
        Outgoings partialUpdatedOutgoings = new Outgoings();
        partialUpdatedOutgoings.setId(outgoings.getId());

        partialUpdatedOutgoings
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION)
            .date(UPDATED_DATE)
            .value(UPDATED_VALUE)
            .billed(UPDATED_BILLED)
            .toChildIdea(UPDATED_TO_CHILD_IDEA)
            .auto(UPDATED_AUTO);

        restOutgoingsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOutgoings.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOutgoings))
            )
            .andExpect(status().isOk());

        // Validate the Outgoings in the database
        List<Outgoings> outgoingsList = outgoingsRepository.findAll();
        assertThat(outgoingsList).hasSize(databaseSizeBeforeUpdate);
        Outgoings testOutgoings = outgoingsList.get(outgoingsList.size() - 1);
        assertThat(testOutgoings.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testOutgoings.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testOutgoings.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testOutgoings.getValue()).isEqualTo(UPDATED_VALUE);
        assertThat(testOutgoings.getBilled()).isEqualTo(UPDATED_BILLED);
        assertThat(testOutgoings.getToChildIdea()).isEqualTo(UPDATED_TO_CHILD_IDEA);
        assertThat(testOutgoings.getAuto()).isEqualTo(UPDATED_AUTO);
    }

    @Test
    @Transactional
    void patchNonExistingOutgoings() throws Exception {
        int databaseSizeBeforeUpdate = outgoingsRepository.findAll().size();
        outgoings.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOutgoingsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, outgoings.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(outgoings))
            )
            .andExpect(status().isBadRequest());

        // Validate the Outgoings in the database
        List<Outgoings> outgoingsList = outgoingsRepository.findAll();
        assertThat(outgoingsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchOutgoings() throws Exception {
        int databaseSizeBeforeUpdate = outgoingsRepository.findAll().size();
        outgoings.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOutgoingsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(outgoings))
            )
            .andExpect(status().isBadRequest());

        // Validate the Outgoings in the database
        List<Outgoings> outgoingsList = outgoingsRepository.findAll();
        assertThat(outgoingsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamOutgoings() throws Exception {
        int databaseSizeBeforeUpdate = outgoingsRepository.findAll().size();
        outgoings.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOutgoingsMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(outgoings))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Outgoings in the database
        List<Outgoings> outgoingsList = outgoingsRepository.findAll();
        assertThat(outgoingsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteOutgoings() throws Exception {
        // Initialize the database
        outgoingsRepository.saveAndFlush(outgoings);

        int databaseSizeBeforeDelete = outgoingsRepository.findAll().size();

        // Delete the outgoings
        restOutgoingsMockMvc
            .perform(delete(ENTITY_API_URL_ID, outgoings.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Outgoings> outgoingsList = outgoingsRepository.findAll();
        assertThat(outgoingsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
