package net.createyourideas.app.service.impl;

import java.util.List;
import java.util.Optional;
import net.createyourideas.app.domain.Point;
import net.createyourideas.app.repository.PointRepository;
import net.createyourideas.app.service.PointService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Point}.
 */
@Service
@Transactional
public class PointServiceImpl implements PointService {

    private final Logger log = LoggerFactory.getLogger(PointServiceImpl.class);

    private final PointRepository pointRepository;

    public PointServiceImpl(PointRepository pointRepository) {
        this.pointRepository = pointRepository;
    }

    @Override
    public Point save(Point point) {
        log.debug("Request to save Point : {}", point);
        return pointRepository.save(point);
    }

    @Override
    public Optional<Point> partialUpdate(Point point) {
        log.debug("Request to partially update Point : {}", point);

        return pointRepository
            .findById(point.getId())
            .map(existingPoint -> {
                if (point.getKey() != null) {
                    existingPoint.setKey(point.getKey());
                }
                if (point.getName() != null) {
                    existingPoint.setName(point.getName());
                }
                if (point.getKeyName() != null) {
                    existingPoint.setKeyName(point.getKeyName());
                }
                if (point.getDescription() != null) {
                    existingPoint.setDescription(point.getDescription());
                }
                if (point.getKeyDescription() != null) {
                    existingPoint.setKeyDescription(point.getKeyDescription());
                }
                if (point.getCategory() != null) {
                    existingPoint.setCategory(point.getCategory());
                }
                if (point.getPoints() != null) {
                    existingPoint.setPoints(point.getPoints());
                }
                if (point.getCountPerDay() != null) {
                    existingPoint.setCountPerDay(point.getCountPerDay());
                }
                if (point.getCreationDate() != null) {
                    existingPoint.setCreationDate(point.getCreationDate());
                }

                return existingPoint;
            })
            .map(pointRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Point> findAll() {
        log.debug("Request to get all Points");
        return pointRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Point> findOne(Long id) {
        log.debug("Request to get Point : {}", id);
        return pointRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Point : {}", id);
        pointRepository.deleteById(id);
    }
}
