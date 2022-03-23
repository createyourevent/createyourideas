package net.createyourideas.app.service.impl;


import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Random;
import java.util.Set;

import net.createyourideas.app.domain.Donation;
import net.createyourideas.app.domain.Idea;
import net.createyourideas.app.domain.Income;
import net.createyourideas.app.domain.Outgoings;
import net.createyourideas.app.domain.User;
import net.createyourideas.app.repository.DonationExtRepository;
import net.createyourideas.app.repository.IdeaExtRepository;
import net.createyourideas.app.repository.IncomeExtRepository;
import net.createyourideas.app.repository.OutgoingsExtRepository;
import net.createyourideas.app.service.IdeaAdditionService;
import net.createyourideas.app.tree.Node;
import net.createyourideas.app.tree.TreeUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Idea}.
 */
@Service
@Transactional
public class IdeaAdditionServiceImpl implements IdeaAdditionService {

    private final IdeaExtRepository ideaExtRepository;

    private final IncomeExtRepository incomeExtRepository;

    private final OutgoingsExtRepository outgoingsExtRepository;

    private final DonationExtRepository donationExtRepository;

    private Set<User> users = new HashSet<User>();

    public IdeaAdditionServiceImpl(IdeaExtRepository ideaExtRepository, IncomeExtRepository incomeExtRepository, OutgoingsExtRepository outgoingsExtRepository, DonationExtRepository donationExtRepository) {
        this.ideaExtRepository = ideaExtRepository;
        this.incomeExtRepository = incomeExtRepository;
        this.outgoingsExtRepository = outgoingsExtRepository;
        this.donationExtRepository = donationExtRepository;
        this.loadNodes();
    }

    @Override
    public Page<Idea> findByUserIsCurrentUser(Pageable pageable) {
        return ideaExtRepository.findByUserIsCurrentUser(pageable);
    }

    @Override
    public Page<Idea> findAllById(Long id, Pageable pageable) {
        return ideaExtRepository.findAllById(id, pageable);
    }

    public Float calcIncomes(Long id) {
        List<Income> incomes = this.incomeExtRepository.findAllByIdeaId(id);
        Float total = 0F;
        for(Income i: incomes) {
            total += i.getValue();
        }
        return total;
    }

    public Float calcOutgoings(Long id) {
        List<Outgoings> outgoings = this.outgoingsExtRepository.findAllByIdeaId(id);
        Float total = 0F;
        for(Outgoings i: outgoings) {
            total += i.getValue();
        }
        return total;
    }

    public Float calcDonations(Long id) {
        List<Donation> dos = this.donationExtRepository.findAllByIdeaId(id);
        Float total = 0F;
        for(Donation i: dos) {
            total += i.getAmount();
        }
        return total;
    }


    public void loadNodes() {
        List<Node> nodes = new ArrayList<>();
        List<Idea> ideas = ideaExtRepository.findAllByActiveTrueEagerBalancesIncomeOutcomeDonations();
        List<Idea> activeIdeas = new ArrayList<>();
        for (Idea idea : ideas) {
            if(idea.getActive()) {
                activeIdeas.add(idea);
            }
        }
        for (Idea idea : activeIdeas) {

            String bg = "";
            if(!users.contains(idea.getUser())) {
                this.users.add(idea.getUser());
                Random random = new Random();
                int nextInt = random.nextInt(0xffffff + 1);
                bg = String.format("#%06x", nextInt);
            }

            if (idea.getIdea() == null) {
                nodes.add(new Node(idea.getId().toString(), null, idea, calcIncomes(idea.getId()), calcOutgoings(idea.getId()), calcDonations(idea.getId()), bg));
            } else {
                nodes.add(new Node(idea.getId().toString(), idea.getIdea().getId().toString(), idea,  calcIncomes(idea.getId()), calcOutgoings(idea.getId()), calcDonations(idea.getId()), bg));
            }
    }
        TreeUtils.createTree(nodes);
    }

}
