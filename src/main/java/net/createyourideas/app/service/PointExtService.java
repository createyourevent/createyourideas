package net.createyourideas.app.service;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import net.createyourideas.app.domain.Point;

import java.util.Optional;

/**
 * Service Interface for managing {@link Point}.
 */
public interface PointExtService {
    Point findByKey(String key);
}
