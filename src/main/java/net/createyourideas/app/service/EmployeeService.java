package net.createyourideas.app.service;

import java.util.List;
import java.util.Optional;
import net.createyourideas.app.domain.Employee;

/**
 * Service Interface for managing {@link Employee}.
 */
public interface EmployeeService {
    /**
     * Save a employee.
     *
     * @param employee the entity to save.
     * @return the persisted entity.
     */
    Employee save(Employee employee);

    /**
     * Partially updates a employee.
     *
     * @param employee the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Employee> partialUpdate(Employee employee);

    /**
     * Get all the employees.
     *
     * @return the list of entities.
     */
    List<Employee> findAll();

    /**
     * Get the "id" employee.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Employee> findOne(Long id);

    /**
     * Delete the "id" employee.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
