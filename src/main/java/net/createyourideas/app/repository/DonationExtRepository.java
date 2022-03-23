package net.createyourideas.app.repository;

import java.util.List;
import net.createyourideas.app.domain.Donation;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Donation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DonationExtRepository extends JpaRepository<Donation, Long> {


    List<Donation> findAllByIdeaId(Long id);
}
