package net.createyourideas.app.web.rest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import net.createyourideas.app.domain.Balance;
import net.createyourideas.app.service.CalcService;

@RestController
@RequestMapping("/api")
public class CalcResource {

    private final Logger log = LoggerFactory.getLogger(CalcResource.class);

    private final CalcService calcService;

    public CalcResource(CalcService calcService) {
        this.calcService = calcService;
    }


    @GetMapping("/calc/dailyBalance/{id}")
    public Balance getDailyBalance(@PathVariable Long id) {
        Balance balance = new Balance();
        balance.setDailyBalance(calcService.getDailyBalance(id));
        return balance;
    }


}


