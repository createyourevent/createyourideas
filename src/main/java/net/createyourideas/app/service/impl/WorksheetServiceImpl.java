package net.createyourideas.app.service.impl;

import java.util.List;
import java.util.Optional;
import net.createyourideas.app.domain.Worksheet;
import net.createyourideas.app.repository.WorksheetRepository;
import net.createyourideas.app.service.WorksheetService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Worksheet}.
 */
@Service
@Transactional
public class WorksheetServiceImpl implements WorksheetService {

    private final Logger log = LoggerFactory.getLogger(WorksheetServiceImpl.class);

    private final WorksheetRepository worksheetRepository;

    public WorksheetServiceImpl(WorksheetRepository worksheetRepository) {
        this.worksheetRepository = worksheetRepository;
    }

    @Override
    public Worksheet save(Worksheet worksheet) {
        log.debug("Request to save Worksheet : {}", worksheet);
        return worksheetRepository.save(worksheet);
    }

    @Override
    public Optional<Worksheet> partialUpdate(Worksheet worksheet) {
        log.debug("Request to partially update Worksheet : {}", worksheet);

        return worksheetRepository
            .findById(worksheet.getId())
            .map(existingWorksheet -> {
                if (worksheet.getJobtitle() != null) {
                    existingWorksheet.setJobtitle(worksheet.getJobtitle());
                }
                if (worksheet.getJobdescription() != null) {
                    existingWorksheet.setJobdescription(worksheet.getJobdescription());
                }
                if (worksheet.getDateStart() != null) {
                    existingWorksheet.setDateStart(worksheet.getDateStart());
                }
                if (worksheet.getDateEnd() != null) {
                    existingWorksheet.setDateEnd(worksheet.getDateEnd());
                }
                if (worksheet.getCostHour() != null) {
                    existingWorksheet.setCostHour(worksheet.getCostHour());
                }
                if (worksheet.getHours() != null) {
                    existingWorksheet.setHours(worksheet.getHours());
                }
                if (worksheet.getTotal() != null) {
                    existingWorksheet.setTotal(worksheet.getTotal());
                }
                if (worksheet.getBilled() != null) {
                    existingWorksheet.setBilled(worksheet.getBilled());
                }
                if (worksheet.getAuto() != null) {
                    existingWorksheet.setAuto(worksheet.getAuto());
                }

                return existingWorksheet;
            })
            .map(worksheetRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Worksheet> findAll() {
        log.debug("Request to get all Worksheets");
        return worksheetRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Worksheet> findOne(Long id) {
        log.debug("Request to get Worksheet : {}", id);
        return worksheetRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Worksheet : {}", id);
        worksheetRepository.deleteById(id);
    }
}
