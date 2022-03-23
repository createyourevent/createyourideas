package net.createyourideas.app.repository;

import java.util.List;
import net.createyourideas.app.domain.Employee;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Employee entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    @Query("select employee from Employee employee where employee.user.login = ?#{principal.preferredUsername}")
    List<Employee> findByUserIsCurrentUser();
}
