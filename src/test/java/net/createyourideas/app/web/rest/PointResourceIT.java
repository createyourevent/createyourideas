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
import net.createyourideas.app.domain.Point;
import net.createyourideas.app.domain.enumeration.PointsCategory;
import net.createyourideas.app.repository.PointRepository;
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
 * Integration tests for the {@link PointResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PointResourceIT {

    private static final String DEFAULT_KEY = "AAAAAAAAAA";
    private static final String UPDATED_KEY = "BBBBBBBBBB";

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_KEY_NAME = "AAAAAAAAAA";
    private static final String UPDATED_KEY_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_KEY_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_KEY_DESCRIPTION = "BBBBBBBBBB";

    private static final PointsCategory DEFAULT_CATEGORY = PointsCategory.EVENT;
    private static final PointsCategory UPDATED_CATEGORY = PointsCategory.SHOP;

    private static final Long DEFAULT_POINTS = 1L;
    private static final Long UPDATED_POINTS = 2L;

    private static final Long DEFAULT_COUNT_PER_DAY = 1L;
    private static final Long UPDATED_COUNT_PER_DAY = 2L;

    private static final ZonedDateTime DEFAULT_CREATION_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATION_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/points";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PointRepository pointRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPointMockMvc;

    private Point point;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Point createEntity(EntityManager em) {
        Point point = new Point()
            .key(DEFAULT_KEY)
            .name(DEFAULT_NAME)
            .keyName(DEFAULT_KEY_NAME)
            .description(DEFAULT_DESCRIPTION)
            .keyDescription(DEFAULT_KEY_DESCRIPTION)
            .category(DEFAULT_CATEGORY)
            .points(DEFAULT_POINTS)
            .countPerDay(DEFAULT_COUNT_PER_DAY)
            .creationDate(DEFAULT_CREATION_DATE);
        return point;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Point createUpdatedEntity(EntityManager em) {
        Point point = new Point()
            .key(UPDATED_KEY)
            .name(UPDATED_NAME)
            .keyName(UPDATED_KEY_NAME)
            .description(UPDATED_DESCRIPTION)
            .keyDescription(UPDATED_KEY_DESCRIPTION)
            .category(UPDATED_CATEGORY)
            .points(UPDATED_POINTS)
            .countPerDay(UPDATED_COUNT_PER_DAY)
            .creationDate(UPDATED_CREATION_DATE);
        return point;
    }

    @BeforeEach
    public void initTest() {
        point = createEntity(em);
    }

    @Test
    @Transactional
    void createPoint() throws Exception {
        int databaseSizeBeforeCreate = pointRepository.findAll().size();
        // Create the Point
        restPointMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(point))
            )
            .andExpect(status().isCreated());

        // Validate the Point in the database
        List<Point> pointList = pointRepository.findAll();
        assertThat(pointList).hasSize(databaseSizeBeforeCreate + 1);
        Point testPoint = pointList.get(pointList.size() - 1);
        assertThat(testPoint.getKey()).isEqualTo(DEFAULT_KEY);
        assertThat(testPoint.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testPoint.getKeyName()).isEqualTo(DEFAULT_KEY_NAME);
        assertThat(testPoint.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testPoint.getKeyDescription()).isEqualTo(DEFAULT_KEY_DESCRIPTION);
        assertThat(testPoint.getCategory()).isEqualTo(DEFAULT_CATEGORY);
        assertThat(testPoint.getPoints()).isEqualTo(DEFAULT_POINTS);
        assertThat(testPoint.getCountPerDay()).isEqualTo(DEFAULT_COUNT_PER_DAY);
        assertThat(testPoint.getCreationDate()).isEqualTo(DEFAULT_CREATION_DATE);
    }

    @Test
    @Transactional
    void createPointWithExistingId() throws Exception {
        // Create the Point with an existing ID
        point.setId(1L);

        int databaseSizeBeforeCreate = pointRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPointMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(point))
            )
            .andExpect(status().isBadRequest());

        // Validate the Point in the database
        List<Point> pointList = pointRepository.findAll();
        assertThat(pointList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllPoints() throws Exception {
        // Initialize the database
        pointRepository.saveAndFlush(point);

        // Get all the pointList
        restPointMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(point.getId().intValue())))
            .andExpect(jsonPath("$.[*].key").value(hasItem(DEFAULT_KEY)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].keyName").value(hasItem(DEFAULT_KEY_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].keyDescription").value(hasItem(DEFAULT_KEY_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].category").value(hasItem(DEFAULT_CATEGORY.toString())))
            .andExpect(jsonPath("$.[*].points").value(hasItem(DEFAULT_POINTS.intValue())))
            .andExpect(jsonPath("$.[*].countPerDay").value(hasItem(DEFAULT_COUNT_PER_DAY.intValue())))
            .andExpect(jsonPath("$.[*].creationDate").value(hasItem(sameInstant(DEFAULT_CREATION_DATE))));
    }

    @Test
    @Transactional
    void getPoint() throws Exception {
        // Initialize the database
        pointRepository.saveAndFlush(point);

        // Get the point
        restPointMockMvc
            .perform(get(ENTITY_API_URL_ID, point.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(point.getId().intValue()))
            .andExpect(jsonPath("$.key").value(DEFAULT_KEY))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.keyName").value(DEFAULT_KEY_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.keyDescription").value(DEFAULT_KEY_DESCRIPTION))
            .andExpect(jsonPath("$.category").value(DEFAULT_CATEGORY.toString()))
            .andExpect(jsonPath("$.points").value(DEFAULT_POINTS.intValue()))
            .andExpect(jsonPath("$.countPerDay").value(DEFAULT_COUNT_PER_DAY.intValue()))
            .andExpect(jsonPath("$.creationDate").value(sameInstant(DEFAULT_CREATION_DATE)));
    }

    @Test
    @Transactional
    void getNonExistingPoint() throws Exception {
        // Get the point
        restPointMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewPoint() throws Exception {
        // Initialize the database
        pointRepository.saveAndFlush(point);

        int databaseSizeBeforeUpdate = pointRepository.findAll().size();

        // Update the point
        Point updatedPoint = pointRepository.findById(point.getId()).get();
        // Disconnect from session so that the updates on updatedPoint are not directly saved in db
        em.detach(updatedPoint);
        updatedPoint
            .key(UPDATED_KEY)
            .name(UPDATED_NAME)
            .keyName(UPDATED_KEY_NAME)
            .description(UPDATED_DESCRIPTION)
            .keyDescription(UPDATED_KEY_DESCRIPTION)
            .category(UPDATED_CATEGORY)
            .points(UPDATED_POINTS)
            .countPerDay(UPDATED_COUNT_PER_DAY)
            .creationDate(UPDATED_CREATION_DATE);

        restPointMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPoint.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPoint))
            )
            .andExpect(status().isOk());

        // Validate the Point in the database
        List<Point> pointList = pointRepository.findAll();
        assertThat(pointList).hasSize(databaseSizeBeforeUpdate);
        Point testPoint = pointList.get(pointList.size() - 1);
        assertThat(testPoint.getKey()).isEqualTo(UPDATED_KEY);
        assertThat(testPoint.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testPoint.getKeyName()).isEqualTo(UPDATED_KEY_NAME);
        assertThat(testPoint.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testPoint.getKeyDescription()).isEqualTo(UPDATED_KEY_DESCRIPTION);
        assertThat(testPoint.getCategory()).isEqualTo(UPDATED_CATEGORY);
        assertThat(testPoint.getPoints()).isEqualTo(UPDATED_POINTS);
        assertThat(testPoint.getCountPerDay()).isEqualTo(UPDATED_COUNT_PER_DAY);
        assertThat(testPoint.getCreationDate()).isEqualTo(UPDATED_CREATION_DATE);
    }

    @Test
    @Transactional
    void putNonExistingPoint() throws Exception {
        int databaseSizeBeforeUpdate = pointRepository.findAll().size();
        point.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPointMockMvc
            .perform(
                put(ENTITY_API_URL_ID, point.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(point))
            )
            .andExpect(status().isBadRequest());

        // Validate the Point in the database
        List<Point> pointList = pointRepository.findAll();
        assertThat(pointList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPoint() throws Exception {
        int databaseSizeBeforeUpdate = pointRepository.findAll().size();
        point.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPointMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(point))
            )
            .andExpect(status().isBadRequest());

        // Validate the Point in the database
        List<Point> pointList = pointRepository.findAll();
        assertThat(pointList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPoint() throws Exception {
        int databaseSizeBeforeUpdate = pointRepository.findAll().size();
        point.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPointMockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(point))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Point in the database
        List<Point> pointList = pointRepository.findAll();
        assertThat(pointList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePointWithPatch() throws Exception {
        // Initialize the database
        pointRepository.saveAndFlush(point);

        int databaseSizeBeforeUpdate = pointRepository.findAll().size();

        // Update the point using partial update
        Point partialUpdatedPoint = new Point();
        partialUpdatedPoint.setId(point.getId());

        partialUpdatedPoint
            .name(UPDATED_NAME)
            .keyName(UPDATED_KEY_NAME)
            .category(UPDATED_CATEGORY)
            .points(UPDATED_POINTS)
            .countPerDay(UPDATED_COUNT_PER_DAY)
            .creationDate(UPDATED_CREATION_DATE);

        restPointMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPoint.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPoint))
            )
            .andExpect(status().isOk());

        // Validate the Point in the database
        List<Point> pointList = pointRepository.findAll();
        assertThat(pointList).hasSize(databaseSizeBeforeUpdate);
        Point testPoint = pointList.get(pointList.size() - 1);
        assertThat(testPoint.getKey()).isEqualTo(DEFAULT_KEY);
        assertThat(testPoint.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testPoint.getKeyName()).isEqualTo(UPDATED_KEY_NAME);
        assertThat(testPoint.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testPoint.getKeyDescription()).isEqualTo(DEFAULT_KEY_DESCRIPTION);
        assertThat(testPoint.getCategory()).isEqualTo(UPDATED_CATEGORY);
        assertThat(testPoint.getPoints()).isEqualTo(UPDATED_POINTS);
        assertThat(testPoint.getCountPerDay()).isEqualTo(UPDATED_COUNT_PER_DAY);
        assertThat(testPoint.getCreationDate()).isEqualTo(UPDATED_CREATION_DATE);
    }

    @Test
    @Transactional
    void fullUpdatePointWithPatch() throws Exception {
        // Initialize the database
        pointRepository.saveAndFlush(point);

        int databaseSizeBeforeUpdate = pointRepository.findAll().size();

        // Update the point using partial update
        Point partialUpdatedPoint = new Point();
        partialUpdatedPoint.setId(point.getId());

        partialUpdatedPoint
            .key(UPDATED_KEY)
            .name(UPDATED_NAME)
            .keyName(UPDATED_KEY_NAME)
            .description(UPDATED_DESCRIPTION)
            .keyDescription(UPDATED_KEY_DESCRIPTION)
            .category(UPDATED_CATEGORY)
            .points(UPDATED_POINTS)
            .countPerDay(UPDATED_COUNT_PER_DAY)
            .creationDate(UPDATED_CREATION_DATE);

        restPointMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPoint.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPoint))
            )
            .andExpect(status().isOk());

        // Validate the Point in the database
        List<Point> pointList = pointRepository.findAll();
        assertThat(pointList).hasSize(databaseSizeBeforeUpdate);
        Point testPoint = pointList.get(pointList.size() - 1);
        assertThat(testPoint.getKey()).isEqualTo(UPDATED_KEY);
        assertThat(testPoint.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testPoint.getKeyName()).isEqualTo(UPDATED_KEY_NAME);
        assertThat(testPoint.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testPoint.getKeyDescription()).isEqualTo(UPDATED_KEY_DESCRIPTION);
        assertThat(testPoint.getCategory()).isEqualTo(UPDATED_CATEGORY);
        assertThat(testPoint.getPoints()).isEqualTo(UPDATED_POINTS);
        assertThat(testPoint.getCountPerDay()).isEqualTo(UPDATED_COUNT_PER_DAY);
        assertThat(testPoint.getCreationDate()).isEqualTo(UPDATED_CREATION_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingPoint() throws Exception {
        int databaseSizeBeforeUpdate = pointRepository.findAll().size();
        point.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPointMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, point.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(point))
            )
            .andExpect(status().isBadRequest());

        // Validate the Point in the database
        List<Point> pointList = pointRepository.findAll();
        assertThat(pointList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPoint() throws Exception {
        int databaseSizeBeforeUpdate = pointRepository.findAll().size();
        point.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPointMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(point))
            )
            .andExpect(status().isBadRequest());

        // Validate the Point in the database
        List<Point> pointList = pointRepository.findAll();
        assertThat(pointList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPoint() throws Exception {
        int databaseSizeBeforeUpdate = pointRepository.findAll().size();
        point.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPointMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(point))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Point in the database
        List<Point> pointList = pointRepository.findAll();
        assertThat(pointList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePoint() throws Exception {
        // Initialize the database
        pointRepository.saveAndFlush(point);

        int databaseSizeBeforeDelete = pointRepository.findAll().size();

        // Delete the point
        restPointMockMvc
            .perform(delete(ENTITY_API_URL_ID, point.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Point> pointList = pointRepository.findAll();
        assertThat(pointList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
