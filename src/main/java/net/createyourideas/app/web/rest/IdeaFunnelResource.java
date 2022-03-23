package net.createyourideas.app.web.rest;


import net.createyourideas.app.domain.Balance;
import net.createyourideas.app.domain.Idea;
import net.createyourideas.app.domain.Income;
import net.createyourideas.app.domain.MonthlyIncomeInvoice;
import net.createyourideas.app.domain.MonthlyOutgoingsInvoice;
import net.createyourideas.app.domain.Outgoings;
import net.createyourideas.app.domain.Properties;
import net.createyourideas.app.service.BalanceExtService;
import net.createyourideas.app.service.BalanceService;
import net.createyourideas.app.service.CalcService;
import net.createyourideas.app.service.IdeaAdditionService;
import net.createyourideas.app.service.IdeaExtService;
import net.createyourideas.app.service.IdeaService;
import net.createyourideas.app.service.IncomeService;
import net.createyourideas.app.service.MonthlyIncomeInvoiceService;
import net.createyourideas.app.service.MonthlyOutgoingsInvoiceService;
import net.createyourideas.app.service.OutgoingsService;
import net.createyourideas.app.service.PropertiesExtService;
import net.createyourideas.app.service.PropertiesService;

import org.hibernate.Hibernate;
import org.hibernate.Session;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.*;

import net.createyourideas.app.tree.Node;
import  net.createyourideas.app.tree.TreeUtils;

import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;


/**
 * REST controller for managing
 * {@link net.createyourideas.accounting.domain.Idea}.
 */
@RestController
@RequestMapping("/api")
public class IdeaFunnelResource {

    private final Logger log = LoggerFactory.getLogger(IdeaFunnelResource.class);

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final IdeaAdditionService ideaAdditionService;

    private final CalcService calcService;

    private final BalanceExtService balanceExtService;

    private final IdeaExtService ideaExtService;

    private final IdeaService ideaService;

    private final IncomeService incomeService;

    private final OutgoingsService outgoingsService;

    private final BalanceService balanceService;

    private final MonthlyIncomeInvoiceService monthlyIncomeInvoiceService;

    private final MonthlyOutgoingsInvoiceService monthlyOutgoingsInvoiceService;

    private final PropertiesExtService propertiesExtService;

    @Autowired
	private Session session;

    public IdeaFunnelResource(IdeaAdditionService ideaAdditionService,
                              CalcService calcService,
                              BalanceExtService balanceExtService,
                              BalanceService balanceService,
                              IdeaExtService ideaExtService,
                              IdeaService ideaService, IncomeService incomeService,
                              OutgoingsService outgoingsService,
                              MonthlyIncomeInvoiceService monthlyIncomeInvoiceService,
                              MonthlyOutgoingsInvoiceService monthlyOutgoingsInvoiceService,
                              PropertiesExtService propertiesExtService) {
        this.ideaAdditionService = ideaAdditionService;
        this.calcService = calcService;
        this.balanceExtService = balanceExtService;
        this.balanceService = balanceService;
        this.ideaExtService = ideaExtService;
        this.ideaService = ideaService;
        this.incomeService = incomeService;
        this.outgoingsService = outgoingsService;
        this.monthlyIncomeInvoiceService = monthlyIncomeInvoiceService;
        this.monthlyOutgoingsInvoiceService = monthlyOutgoingsInvoiceService;
        this.propertiesExtService = propertiesExtService;
    }

    @GetMapping(value = "/ideas/ideafunnel", produces = "application/json")
    public ResponseEntity<String> getIdeafunnel(Pageable pageable) {
        log.debug("REST get ideafunnel");
        String json = "";
        json = getIdeaFunnelJSON();
        return ResponseEntity.ok(json);
    }

    @GetMapping(value = "/ideas/calcBalances")
    public void getBalancesDaily() {
        log.debug("Calc ideafunnel");
        this.scheduleTaskCalculateProfit();
    }

    @GetMapping(value = "/ideas/calcMonthlyBalances")
    public void getBalancesMonthly() {
        log.debug("Calc ideafunnel");
        this.scheduleTaskCalculateInvoices();
    }


    private String getIdeaFunnelJSON() {
        log.debug("REST get ideafunnel");
        String json = "";
        json = "{\n" + "\"format\":\"nodeTree\",\n" + "\"data\": \n" + TreeUtils.getIdeaFunnelJSON() + "\n" + "}";
        return json;
    }


    @Scheduled(cron = "0 0 0 * * ?")
    public void scheduleTaskCalculateProfitScheduled() {
        this.scheduleTaskCalculateProfit();
    }


    public void scheduleTaskCalculateProfit() {
        Map<String, Node> nodeTree = TreeUtils.getNodeTree();

        Properties prop = this.propertiesExtService.findByKey("base_rate");
        Float rate = Float.parseFloat(prop.getValue());

        for(Node node: nodeTree.values()) {

            Balance balance = new Balance();
            balance.setIdea(node.getIdea());
            balance.setDate(ZonedDateTime.now());
            balance.setDailyBalance(this.calcService.getDailyBalance(node.getIdea().getId()));
            if(balance.getDailyBalance() > 0) {
                balance.setNetProfit(balance.getDailyBalance() * rate);
            } else {
                balance.setNetProfit(0f);
            }
            node.getIdea().addBalances(balance);
            this.balanceService.save(balance);
            this.ideaService.save(node.getIdea());



                Float f = 0F;

                for(Balance b : node.getIdea().getBalances()) {
                    if(b.getBilled() == null || b.getBilled() == false){
                        f += b.getNetProfit();
                        b.setBilled(true);
                        this.balanceService.partialUpdate(b);
                    }
                }

                if(node.getParent() != null) {
                    Float out = node.getParent().getIdea().getInterest() * f;
                    log.warn("REST request to " + node.getIdea().getTitle());
                    if(out >= 0) {
                        Income income = new Income();
                        income.setTitle("Income interest from child idea");
                        income.setDescription("Income interest from child idea: " + node.getIdea().getTitle());
                        income.setDate(ZonedDateTime.now());
                        income.setValue(out);
                        income.setFromParentIdea(false);
                        income.setIdea(node.getParent().getIdea());
                        income.setAuto(true);
                        income.addIncomeIdeas(node.getIdea());
                        this.incomeService.save(income);

                        Outgoings outgoing = new Outgoings();
                        outgoing.setTitle("Outgoing interest to parent idea");
                        outgoing.setDescription("Outgoing interest to parent: " + node.getParent().getIdea().getTitle());
                        outgoing.setValue(out);
                        outgoing.setDate(ZonedDateTime.now());
                        outgoing.setToChildIdea(false);
                        outgoing.setIdea(node.getIdea());
                        outgoing.setAuto(true);
                        outgoing.addOutgoingIdeas(node.getParent().getIdea());
                        this.outgoingsService.save(outgoing);
                    }
                }



            Float forward = (balance.getNetProfit() * node.getIdea().getDistribution()) / node.getChildren().size();

            for(Node n : node.getChildren()) {
                if(forward >= 0) {
                    Income incomeFromParent = new Income();
                    incomeFromParent.setTitle("Income distribution from parent.");
                    incomeFromParent.setDescription("Income distribution from parent idea: " + node.getIdea().getTitle());
                    incomeFromParent.setDate(ZonedDateTime.now());
                    incomeFromParent.setValue(forward);
                    incomeFromParent.setFromParentIdea(true);
                    incomeFromParent.setIdea(n.getIdea());
                    incomeFromParent.setAuto(true);
                    incomeFromParent.addIncomeIdeas(node.getIdea());
                    n.getIdea().addIncomes(incomeFromParent);
                    this.incomeService.save(incomeFromParent);
                }
            }

            for(Node n : node.getChildren()) {
                if(forward >= 0) {
                    Outgoings outgoingToChild = new Outgoings();
                    outgoingToChild.setTitle("Outgoing distribution to child");
                    outgoingToChild.setDescription("Outgoing distribution to child: " + n.getIdea().getTitle());
                    outgoingToChild.setDate(ZonedDateTime.now());
                    outgoingToChild.setValue(forward);
                    outgoingToChild.setToChildIdea(true);
                    outgoingToChild.setIdea(node.getIdea());
                    outgoingToChild.setAuto(true);
                    outgoingToChild.addOutgoingIdeas(n.getIdea());
                    node.getIdea().addOutgoings(outgoingToChild);
                    this.outgoingsService.save(outgoingToChild);
                }
            }

            if(node.getChildren() == null || node.getChildren().size() == 0) {

                Node root = TreeUtils.getRoot();

                Income inFromLastChild = new Income();
                inFromLastChild.setTitle("Income from last child");
                inFromLastChild.setDescription("Income from last child: " + node.getIdea().getTitle());
                inFromLastChild.setDate(ZonedDateTime.now());
                inFromLastChild.setValue(balance.getNetProfit());
                inFromLastChild.setFromParentIdea(true);
                inFromLastChild.setIdea(root.getIdea());
                inFromLastChild.setAuto(true);
                inFromLastChild.addIncomeIdeas(node.getIdea());
                root.getIdea().addIncomes(inFromLastChild);
                this.incomeService.save(inFromLastChild);

                Outgoings outToRoot = new Outgoings();
                outToRoot.setTitle("Outgoing to root idea");
                outToRoot.setDescription("Outgoing to root: Create Your Ideas");
                outToRoot.setDate(ZonedDateTime.now());
                outToRoot.setValue(balance.getNetProfit());
                outToRoot.setToChildIdea(true);
                outToRoot.setIdea(node.getIdea());
                outToRoot.setAuto(true);
                outToRoot.addOutgoingIdeas(root.getIdea());
                node.getIdea().addOutgoings(outToRoot);
                this.outgoingsService.save(outToRoot);
            }

        }
    }

    @Scheduled(cron = "0 0 0 1 * *")
    public void scheduleTaskCalculateInvoices() {
        Map<String, Node> nodeTree = TreeUtils.getNodeTree();
        ZonedDateTime now = ZonedDateTime.now();

        for(String key : nodeTree.keySet()) {
            Node node = nodeTree.get(key);
            Idea idea = node.getIdea();

            // All system incomes from invoice
            List<Income> parentIncomes = new ArrayList<Income>();
            Float total = 0F;
            for(Income income: idea.getIncomes()) {
                if(income.getFromParentIdea() != null) {
                    if(income.getFromParentIdea() && income.getDate().getMonth() == now.getMonth() && income.getBilled() == false) {
                        parentIncomes.add(income);
                        income.setBilled(true);
                        this.incomeService.partialUpdate(income);
                    }
                }
            }
            for(Income income: parentIncomes) {
                total += income.getValue();
            }
            MonthlyIncomeInvoice mii = new MonthlyIncomeInvoice();
            mii.setTotal(total);
            mii.setDate(ZonedDateTime.now());
            mii.setIdea(idea);
            this.monthlyIncomeInvoiceService.save(mii);
            idea.addMonthlyIncomeInvoices(mii);

            // All system outgoings from invoice
            List<Outgoings> childOutgoings = new ArrayList<Outgoings>();
            Float totalOut = 0F;
            for(Outgoings outgoing: idea.getOutgoings()) {
                if(outgoing.getToChildIdea() != null) {
                    if(outgoing.getToChildIdea() && outgoing.getDate().getMonth() == now.getMonth() && outgoing.getBilled() == false) {
                        childOutgoings.add(outgoing);
                        outgoing.setBilled(true);
                        this.outgoingsService.partialUpdate(outgoing);
                    }
                }
            }
            for(Outgoings outgoing: childOutgoings) {
                totalOut += outgoing.getValue();
            }
            MonthlyOutgoingsInvoice moi = new MonthlyOutgoingsInvoice();
            moi.setTotal(totalOut);
            moi.setDate(ZonedDateTime.now());
            moi.setIdea(idea);
            this.monthlyOutgoingsInvoiceService.save(moi);
            idea.addMonthlyOutgoingsInvoice(moi);
            this.ideaService.save(idea);
        }
    }
}
