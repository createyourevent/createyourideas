package net.createyourideas.app.service.impl;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import net.createyourideas.app.domain.Point;
import net.createyourideas.app.repository.PointExtRepository;
import net.createyourideas.app.service.PointExtService;

import java.util.Optional;

/**
 * Service Implementation for managing {@link Point}.
 */
@Service
@Transactional
public class PointExtServiceImpl implements PointExtService {

    private final Logger log = LoggerFactory.getLogger(PointServiceImpl.class);

    private final PointExtRepository pointExtRepository;

    public PointExtServiceImpl(PointExtRepository pointExtRepository) {
        this.pointExtRepository = pointExtRepository;
    }

    @Override
    public Point findByKey(String key) {
        return pointExtRepository.findByKey(key);
    }
}
