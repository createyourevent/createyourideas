package net.createyourideas.app.repository;

import net.createyourideas.app.domain.ProfitBalance;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ProfitBalance entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProfitBalanceRepository extends JpaRepository<ProfitBalance, Long> {}
