package net.createyourideas.app.repository;

import net.createyourideas.app.domain.Worksheet;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Worksheet entity.
 */
@SuppressWarnings("unused")
@Repository
public interface WorksheetRepository extends JpaRepository<Worksheet, Long> {}
