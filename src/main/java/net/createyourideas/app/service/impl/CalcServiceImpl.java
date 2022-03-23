package net.createyourideas.app.service.impl;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import net.createyourideas.app.domain.Balance;
import net.createyourideas.app.domain.Donation;
import net.createyourideas.app.domain.Idea;
import net.createyourideas.app.domain.Income;
import net.createyourideas.app.domain.Outgoings;
import net.createyourideas.app.domain.Worksheet;
import net.createyourideas.app.repository.IncomeExtRepository;
import net.createyourideas.app.repository.IncomeRepository;
import net.createyourideas.app.repository.OutgoingsExtRepository;
import net.createyourideas.app.repository.OutgoingsRepository;
import net.createyourideas.app.service.CalcService;
import net.createyourideas.app.service.DonationService;
import net.createyourideas.app.service.IdeaExtService;
import net.createyourideas.app.service.IdeaService;
import net.createyourideas.app.service.IncomeService;
import net.createyourideas.app.service.OutgoingsService;
import net.createyourideas.app.service.WorksheetService;
import net.createyourideas.app.tree.Node;
import net.createyourideas.app.tree.TreeUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;




/**
 * Service Implementation for managing financeservice.
 */
@Service
@Transactional
public class CalcServiceImpl implements CalcService {


    private final IncomeExtRepository incomeExtRepository;
    private final OutgoingsExtRepository outgoingsExtRepository;
    private final IdeaExtService ideaExtService;

    private final IncomeService incomeService;
    private final OutgoingsService outgoingsService;
    private final DonationService donationService;
    private final WorksheetService worksheetService;


    public CalcServiceImpl(IncomeExtRepository incomeExtRepository,
                           OutgoingsExtRepository outgoingsExtRepository,
                           IdeaExtService ideaExtService,
                           IncomeService incomeService,
                           OutgoingsService outgoingsService,
                           DonationService donationService,
                           WorksheetService worksheetService) {
        this.incomeExtRepository = incomeExtRepository;
        this.outgoingsExtRepository = outgoingsExtRepository;
        this.ideaExtService = ideaExtService;
        this.incomeService = incomeService;
        this.outgoingsService = outgoingsService;
        this.donationService = donationService;
        this.worksheetService = worksheetService;
    }

    @Override
    public Float getDailyBalance(Long id) {

        Idea idea = this.ideaExtService.findOneByActiveTrueAndId(id);

        List<Income> incomes = incomeExtRepository.findAllByIdeaId(id);
        List<Income> incomesNotBilled = new ArrayList<Income>();
        for (Income i : incomes) {
            if(i.getBilled() == null || !i.getBilled()) {
                incomesNotBilled.add(i);
            }
        }


        List<Outgoings> outgoings = outgoingsExtRepository.findAllByIdeaId(id);
        List<Outgoings> outgoingsNotBilled = new ArrayList<Outgoings>();
        for (Outgoings o : outgoings) {
            if(o.getBilled() == null || !o.getBilled()) {
                outgoingsNotBilled.add(o);
            }
        }

        Set<Donation> donations = idea.getDonations();
        Set<Donation> donationsNotBilled = new HashSet<Donation>();
        for (Donation d : donations) {
            if(d.getBilled() == null || !d.getBilled()) {
                donationsNotBilled.add(d);
            }
        }

        Set<Worksheet> worksheets = idea.getWorksheets();
        Set<Worksheet> worksheetsNotBilled = new HashSet<Worksheet>();
        for (Worksheet w : worksheets) {
            if(w.getBilled() == null || !w.getBilled()) {
                worksheetsNotBilled.add(w);
            }
        }

        Float totalIncomes = 0F;
        Float totalOutgoings = 0F;
        for (Income i : incomesNotBilled) {
            totalIncomes += i.getValue();
            i.setBilled(true);
            this.incomeService.save(i);
        }
        for (Outgoings o : outgoingsNotBilled) {
            totalOutgoings += o.getValue();
            o.setBilled(true);
            this.outgoingsService.save(o);
        }
        Float totalDonations = 0F;
        for (Donation d : donationsNotBilled) {
            totalDonations += d.getAmount();
            d.setBilled(true);
            this.donationService.save(d);
        }
        Float totalWorksheets = 0F;
        for (Worksheet w : worksheetsNotBilled) {
            totalWorksheets += w.getTotal();
            w.setBilled(true);
            this.worksheetService.save(w);
        }

        return (totalIncomes + totalDonations) - (totalOutgoings + totalWorksheets);
    }

    public Float getProfitFromNode(Long id, Balance balance) {
        Node node = TreeUtils.getNode(id);
        List<Node> childrenOfNode = TreeUtils.getAllChild(node.getId());
        Float profit = 0f;
        for(Node child : childrenOfNode) {
            profit +=  balance.getDailyBalance() * child.getIdea().getInterest();
        }
        return profit;
    }

    /*
    @Override
    public Float getProfitToSpend(Long id, Balance balance) {
        return 0.75f * balance.getProfit();
    }

    @Override
    public Float getNetProfit(Long id, Balance balance) {
        return balance.getProfit() - balance.getProfitToSpend();
    }

    @Override
    public Float getCollectionFromRoot(Balance balance) {
        Node root = TreeUtils.getRoot();
        List<Node> children = TreeUtils.getAllChild(root.getId());
        Float collection = balance.getProfitToSpend() / children.size();
        return collection;
    }

    */

}
