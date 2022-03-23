package net.createyourideas.app.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import net.createyourideas.app.domain.Point;

/**
 * Spring Data  repository for the Point entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PointExtRepository extends JpaRepository<Point, Long> {

    Point findByKey(String key);
}
