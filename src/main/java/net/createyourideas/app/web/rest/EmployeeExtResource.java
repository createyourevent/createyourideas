package net.createyourideas.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import net.createyourideas.app.domain.Employee;
import net.createyourideas.app.repository.EmployeeExtRepository;
import net.createyourideas.app.repository.EmployeeRepository;
import net.createyourideas.app.service.EmployeeExtService;
import net.createyourideas.app.service.EmployeeService;
import net.createyourideas.app.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link net.createyourideas.app.domain.Employee}.
 */
@RestController
@RequestMapping("/api")
public class EmployeeExtResource {

    private final Logger log = LoggerFactory.getLogger(EmployeeExtResource.class);

    private static final String ENTITY_NAME = "employee";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EmployeeExtService employeeExtService;

    private final EmployeeExtRepository employeeExtRepository;

    public EmployeeExtResource(EmployeeExtService employeeExtService, EmployeeExtRepository employeeExtRepository) {
        this.employeeExtService = employeeExtService;
        this.employeeExtRepository = employeeExtRepository;
    }



    @GetMapping("/employees/{id}/byUserId")
    public Employee getEmployee(@PathVariable String id) {
        log.debug("REST request to get Employee : {}", id);
        Employee employee = employeeExtService.findOneByUserId(id);
        return employee;
    }
}
