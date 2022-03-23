package net.createyourideas.app.repository;

import net.createyourideas.app.domain.Share;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Share entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ShareRepository extends JpaRepository<Share, Long> {}
