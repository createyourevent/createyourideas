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
import net.createyourideas.app.domain.Idea;
import net.createyourideas.app.domain.enumeration.Ideatype;
import net.createyourideas.app.repository.IdeaRepository;
import net.createyourideas.app.service.IdeaService;
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
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link IdeaResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class IdeaResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final byte[] DEFAULT_LOGO = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_LOGO = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_LOGO_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_LOGO_CONTENT_TYPE = "image/png";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Ideatype DEFAULT_IDEATYPE = Ideatype.LEVEL1;
    private static final Ideatype UPDATED_IDEATYPE = Ideatype.LEVEL2;

    private static final Float DEFAULT_INTEREST = 0F;
    private static final Float UPDATED_INTEREST = 1F;

    private static final Float DEFAULT_DISTRIBUTION = 0F;
    private static final Float UPDATED_DISTRIBUTION = 1F;

    private static final Float DEFAULT_INVESTMENT = 1F;
    private static final Float UPDATED_INVESTMENT = 2F;

    private static final Boolean DEFAULT_ACTIVE = false;
    private static final Boolean UPDATED_ACTIVE = true;

    private static final ZonedDateTime DEFAULT_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/ideas";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private IdeaRepository ideaRepository;

    @Mock
    private IdeaRepository ideaRepositoryMock;

    @Mock
    private IdeaService ideaServiceMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restIdeaMockMvc;

    private Idea idea;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Idea createEntity(EntityManager em) {
        Idea idea = new Idea()
            .title(DEFAULT_TITLE)
            .logo(DEFAULT_LOGO)
            .logoContentType(DEFAULT_LOGO_CONTENT_TYPE)
            .description(DEFAULT_DESCRIPTION)
            .ideatype(DEFAULT_IDEATYPE)
            .interest(DEFAULT_INTEREST)
            .distribution(DEFAULT_DISTRIBUTION)
            .investment(DEFAULT_INVESTMENT)
            .active(DEFAULT_ACTIVE)
            .date(DEFAULT_DATE);
        return idea;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Idea createUpdatedEntity(EntityManager em) {
        Idea idea = new Idea()
            .title(UPDATED_TITLE)
            .logo(UPDATED_LOGO)
            .logoContentType(UPDATED_LOGO_CONTENT_TYPE)
            .description(UPDATED_DESCRIPTION)
            .ideatype(UPDATED_IDEATYPE)
            .interest(UPDATED_INTEREST)
            .distribution(UPDATED_DISTRIBUTION)
            .investment(UPDATED_INVESTMENT)
            .active(UPDATED_ACTIVE)
            .date(UPDATED_DATE);
        return idea;
    }

    @BeforeEach
    public void initTest() {
        idea = createEntity(em);
    }

    @Test
    @Transactional
    void createIdea() throws Exception {
        int databaseSizeBeforeCreate = ideaRepository.findAll().size();
        // Create the Idea
        restIdeaMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(idea))
            )
            .andExpect(status().isCreated());

        // Validate the Idea in the database
        List<Idea> ideaList = ideaRepository.findAll();
        assertThat(ideaList).hasSize(databaseSizeBeforeCreate + 1);
        Idea testIdea = ideaList.get(ideaList.size() - 1);
        assertThat(testIdea.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testIdea.getLogo()).isEqualTo(DEFAULT_LOGO);
        assertThat(testIdea.getLogoContentType()).isEqualTo(DEFAULT_LOGO_CONTENT_TYPE);
        assertThat(testIdea.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testIdea.getIdeatype()).isEqualTo(DEFAULT_IDEATYPE);
        assertThat(testIdea.getInterest()).isEqualTo(DEFAULT_INTEREST);
        assertThat(testIdea.getDistribution()).isEqualTo(DEFAULT_DISTRIBUTION);
        assertThat(testIdea.getInvestment()).isEqualTo(DEFAULT_INVESTMENT);
        assertThat(testIdea.getActive()).isEqualTo(DEFAULT_ACTIVE);
        assertThat(testIdea.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    void createIdeaWithExistingId() throws Exception {
        // Create the Idea with an existing ID
        idea.setId(1L);

        int databaseSizeBeforeCreate = ideaRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restIdeaMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(idea))
            )
            .andExpect(status().isBadRequest());

        // Validate the Idea in the database
        List<Idea> ideaList = ideaRepository.findAll();
        assertThat(ideaList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkTitleIsRequired() throws Exception {
        int databaseSizeBeforeTest = ideaRepository.findAll().size();
        // set the field null
        idea.setTitle(null);

        // Create the Idea, which fails.

        restIdeaMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(idea))
            )
            .andExpect(status().isBadRequest());

        List<Idea> ideaList = ideaRepository.findAll();
        assertThat(ideaList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkInterestIsRequired() throws Exception {
        int databaseSizeBeforeTest = ideaRepository.findAll().size();
        // set the field null
        idea.setInterest(null);

        // Create the Idea, which fails.

        restIdeaMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(idea))
            )
            .andExpect(status().isBadRequest());

        List<Idea> ideaList = ideaRepository.findAll();
        assertThat(ideaList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDistributionIsRequired() throws Exception {
        int databaseSizeBeforeTest = ideaRepository.findAll().size();
        // set the field null
        idea.setDistribution(null);

        // Create the Idea, which fails.

        restIdeaMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(idea))
            )
            .andExpect(status().isBadRequest());

        List<Idea> ideaList = ideaRepository.findAll();
        assertThat(ideaList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkInvestmentIsRequired() throws Exception {
        int databaseSizeBeforeTest = ideaRepository.findAll().size();
        // set the field null
        idea.setInvestment(null);

        // Create the Idea, which fails.

        restIdeaMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(idea))
            )
            .andExpect(status().isBadRequest());

        List<Idea> ideaList = ideaRepository.findAll();
        assertThat(ideaList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllIdeas() throws Exception {
        // Initialize the database
        ideaRepository.saveAndFlush(idea);

        // Get all the ideaList
        restIdeaMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(idea.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].logoContentType").value(hasItem(DEFAULT_LOGO_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].logo").value(hasItem(Base64Utils.encodeToString(DEFAULT_LOGO))))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].ideatype").value(hasItem(DEFAULT_IDEATYPE.toString())))
            .andExpect(jsonPath("$.[*].interest").value(hasItem(DEFAULT_INTEREST.doubleValue())))
            .andExpect(jsonPath("$.[*].distribution").value(hasItem(DEFAULT_DISTRIBUTION.doubleValue())))
            .andExpect(jsonPath("$.[*].investment").value(hasItem(DEFAULT_INVESTMENT.doubleValue())))
            .andExpect(jsonPath("$.[*].active").value(hasItem(DEFAULT_ACTIVE.booleanValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(sameInstant(DEFAULT_DATE))));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllIdeasWithEagerRelationshipsIsEnabled() throws Exception {
        when(ideaServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restIdeaMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(ideaServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllIdeasWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(ideaServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restIdeaMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(ideaServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    void getIdea() throws Exception {
        // Initialize the database
        ideaRepository.saveAndFlush(idea);

        // Get the idea
        restIdeaMockMvc
            .perform(get(ENTITY_API_URL_ID, idea.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(idea.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE))
            .andExpect(jsonPath("$.logoContentType").value(DEFAULT_LOGO_CONTENT_TYPE))
            .andExpect(jsonPath("$.logo").value(Base64Utils.encodeToString(DEFAULT_LOGO)))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.ideatype").value(DEFAULT_IDEATYPE.toString()))
            .andExpect(jsonPath("$.interest").value(DEFAULT_INTEREST.doubleValue()))
            .andExpect(jsonPath("$.distribution").value(DEFAULT_DISTRIBUTION.doubleValue()))
            .andExpect(jsonPath("$.investment").value(DEFAULT_INVESTMENT.doubleValue()))
            .andExpect(jsonPath("$.active").value(DEFAULT_ACTIVE.booleanValue()))
            .andExpect(jsonPath("$.date").value(sameInstant(DEFAULT_DATE)));
    }

    @Test
    @Transactional
    void getNonExistingIdea() throws Exception {
        // Get the idea
        restIdeaMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewIdea() throws Exception {
        // Initialize the database
        ideaRepository.saveAndFlush(idea);

        int databaseSizeBeforeUpdate = ideaRepository.findAll().size();

        // Update the idea
        Idea updatedIdea = ideaRepository.findById(idea.getId()).get();
        // Disconnect from session so that the updates on updatedIdea are not directly saved in db
        em.detach(updatedIdea);
        updatedIdea
            .title(UPDATED_TITLE)
            .logo(UPDATED_LOGO)
            .logoContentType(UPDATED_LOGO_CONTENT_TYPE)
            .description(UPDATED_DESCRIPTION)
            .ideatype(UPDATED_IDEATYPE)
            .interest(UPDATED_INTEREST)
            .distribution(UPDATED_DISTRIBUTION)
            .investment(UPDATED_INVESTMENT)
            .active(UPDATED_ACTIVE)
            .date(UPDATED_DATE);

        restIdeaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedIdea.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedIdea))
            )
            .andExpect(status().isOk());

        // Validate the Idea in the database
        List<Idea> ideaList = ideaRepository.findAll();
        assertThat(ideaList).hasSize(databaseSizeBeforeUpdate);
        Idea testIdea = ideaList.get(ideaList.size() - 1);
        assertThat(testIdea.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testIdea.getLogo()).isEqualTo(UPDATED_LOGO);
        assertThat(testIdea.getLogoContentType()).isEqualTo(UPDATED_LOGO_CONTENT_TYPE);
        assertThat(testIdea.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testIdea.getIdeatype()).isEqualTo(UPDATED_IDEATYPE);
        assertThat(testIdea.getInterest()).isEqualTo(UPDATED_INTEREST);
        assertThat(testIdea.getDistribution()).isEqualTo(UPDATED_DISTRIBUTION);
        assertThat(testIdea.getInvestment()).isEqualTo(UPDATED_INVESTMENT);
        assertThat(testIdea.getActive()).isEqualTo(UPDATED_ACTIVE);
        assertThat(testIdea.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void putNonExistingIdea() throws Exception {
        int databaseSizeBeforeUpdate = ideaRepository.findAll().size();
        idea.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restIdeaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, idea.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(idea))
            )
            .andExpect(status().isBadRequest());

        // Validate the Idea in the database
        List<Idea> ideaList = ideaRepository.findAll();
        assertThat(ideaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchIdea() throws Exception {
        int databaseSizeBeforeUpdate = ideaRepository.findAll().size();
        idea.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIdeaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(idea))
            )
            .andExpect(status().isBadRequest());

        // Validate the Idea in the database
        List<Idea> ideaList = ideaRepository.findAll();
        assertThat(ideaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamIdea() throws Exception {
        int databaseSizeBeforeUpdate = ideaRepository.findAll().size();
        idea.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIdeaMockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(idea))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Idea in the database
        List<Idea> ideaList = ideaRepository.findAll();
        assertThat(ideaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateIdeaWithPatch() throws Exception {
        // Initialize the database
        ideaRepository.saveAndFlush(idea);

        int databaseSizeBeforeUpdate = ideaRepository.findAll().size();

        // Update the idea using partial update
        Idea partialUpdatedIdea = new Idea();
        partialUpdatedIdea.setId(idea.getId());

        partialUpdatedIdea
            .title(UPDATED_TITLE)
            .logo(UPDATED_LOGO)
            .logoContentType(UPDATED_LOGO_CONTENT_TYPE)
            .description(UPDATED_DESCRIPTION)
            .ideatype(UPDATED_IDEATYPE)
            .distribution(UPDATED_DISTRIBUTION)
            .investment(UPDATED_INVESTMENT);

        restIdeaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedIdea.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedIdea))
            )
            .andExpect(status().isOk());

        // Validate the Idea in the database
        List<Idea> ideaList = ideaRepository.findAll();
        assertThat(ideaList).hasSize(databaseSizeBeforeUpdate);
        Idea testIdea = ideaList.get(ideaList.size() - 1);
        assertThat(testIdea.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testIdea.getLogo()).isEqualTo(UPDATED_LOGO);
        assertThat(testIdea.getLogoContentType()).isEqualTo(UPDATED_LOGO_CONTENT_TYPE);
        assertThat(testIdea.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testIdea.getIdeatype()).isEqualTo(UPDATED_IDEATYPE);
        assertThat(testIdea.getInterest()).isEqualTo(DEFAULT_INTEREST);
        assertThat(testIdea.getDistribution()).isEqualTo(UPDATED_DISTRIBUTION);
        assertThat(testIdea.getInvestment()).isEqualTo(UPDATED_INVESTMENT);
        assertThat(testIdea.getActive()).isEqualTo(DEFAULT_ACTIVE);
        assertThat(testIdea.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    void fullUpdateIdeaWithPatch() throws Exception {
        // Initialize the database
        ideaRepository.saveAndFlush(idea);

        int databaseSizeBeforeUpdate = ideaRepository.findAll().size();

        // Update the idea using partial update
        Idea partialUpdatedIdea = new Idea();
        partialUpdatedIdea.setId(idea.getId());

        partialUpdatedIdea
            .title(UPDATED_TITLE)
            .logo(UPDATED_LOGO)
            .logoContentType(UPDATED_LOGO_CONTENT_TYPE)
            .description(UPDATED_DESCRIPTION)
            .ideatype(UPDATED_IDEATYPE)
            .interest(UPDATED_INTEREST)
            .distribution(UPDATED_DISTRIBUTION)
            .investment(UPDATED_INVESTMENT)
            .active(UPDATED_ACTIVE)
            .date(UPDATED_DATE);

        restIdeaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedIdea.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedIdea))
            )
            .andExpect(status().isOk());

        // Validate the Idea in the database
        List<Idea> ideaList = ideaRepository.findAll();
        assertThat(ideaList).hasSize(databaseSizeBeforeUpdate);
        Idea testIdea = ideaList.get(ideaList.size() - 1);
        assertThat(testIdea.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testIdea.getLogo()).isEqualTo(UPDATED_LOGO);
        assertThat(testIdea.getLogoContentType()).isEqualTo(UPDATED_LOGO_CONTENT_TYPE);
        assertThat(testIdea.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testIdea.getIdeatype()).isEqualTo(UPDATED_IDEATYPE);
        assertThat(testIdea.getInterest()).isEqualTo(UPDATED_INTEREST);
        assertThat(testIdea.getDistribution()).isEqualTo(UPDATED_DISTRIBUTION);
        assertThat(testIdea.getInvestment()).isEqualTo(UPDATED_INVESTMENT);
        assertThat(testIdea.getActive()).isEqualTo(UPDATED_ACTIVE);
        assertThat(testIdea.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingIdea() throws Exception {
        int databaseSizeBeforeUpdate = ideaRepository.findAll().size();
        idea.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restIdeaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, idea.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(idea))
            )
            .andExpect(status().isBadRequest());

        // Validate the Idea in the database
        List<Idea> ideaList = ideaRepository.findAll();
        assertThat(ideaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchIdea() throws Exception {
        int databaseSizeBeforeUpdate = ideaRepository.findAll().size();
        idea.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIdeaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(idea))
            )
            .andExpect(status().isBadRequest());

        // Validate the Idea in the database
        List<Idea> ideaList = ideaRepository.findAll();
        assertThat(ideaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamIdea() throws Exception {
        int databaseSizeBeforeUpdate = ideaRepository.findAll().size();
        idea.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIdeaMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(idea))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Idea in the database
        List<Idea> ideaList = ideaRepository.findAll();
        assertThat(ideaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteIdea() throws Exception {
        // Initialize the database
        ideaRepository.saveAndFlush(idea);

        int databaseSizeBeforeDelete = ideaRepository.findAll().size();

        // Delete the idea
        restIdeaMockMvc
            .perform(delete(ENTITY_API_URL_ID, idea.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Idea> ideaList = ideaRepository.findAll();
        assertThat(ideaList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
