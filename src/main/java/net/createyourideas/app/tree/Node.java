package net.createyourideas.app.tree;

import java.util.ArrayList;
import java.util.List;

import javax.xml.bind.DatatypeConverter;

import net.createyourideas.app.domain.Donation;
import net.createyourideas.app.domain.Idea;
import net.createyourideas.app.domain.Income;
import net.createyourideas.app.domain.Outgoings;


public class Node {
    private String id; // Current node id
    private String parentId; // Parent node id

    private Node parent;
    private List<Node> children;

    private String logo;

    private Idea idea;
    private String bg;

    private Float incomes;
    private Float outgoings;
    private Float donations;



    public Node() {
        super();
        this.children = new ArrayList<>();
    }

    public Node(String childId, String parentId, String title, Float interest, Float distribution, Float investment,
            String type, String description, String logo, Boolean active, String logoContentType) {
        this.id = childId;
        this.parentId = parentId;
        this.children = new ArrayList<>();
        this.logo = logo;
    }

    public Node(String id, String parentId, Idea idea, Float incomes, Float outgoings, Float donations, String bg) {
        this.id = id;
        this.parentId = parentId;
        this.idea = idea;
        this.children = new ArrayList<>();
        this.incomes = incomes;
        this.outgoings = outgoings;
        this.donations = donations;
        this.bg = bg;
    }

    public String getLogo() {
        return logo;
    }

    public void setLogo(String logo) {
        this.logo = logo;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getParentId() {
        return parentId;
    }

    public void setParentId(String parentId) {
        this.parentId = parentId;
    }

    public Node getParent() {
        return parent;
    }

    public void setParent(Node parent) {
        this.parent = parent;
    }

    public List<Node> getChildren() {
        return children;
    }

    public void setChildren(List<Node> children) {
        this.children = children;
    }

    public void addChild(Node child) {
        if (!this.children.contains(child) && child != null)
            this.children.add(child);
    }

    public Idea getIdea() {
        return idea;
    }

    public void setIdea(Idea idea) {
        this.idea = idea;
    }

    @Override
    public String toString() {
        String json = "";
        String image = DatatypeConverter.printBase64Binary(idea.getLogo());


        /*
        Float income = 0f;
        for(Income i: this.idea.getIncomes()) {
            income += i.getValue();
        }

        Float outgoing = 0f;
        for(Outgoings i: this.idea.getOutgoings()) {
            outgoing += i.getValue();
        }

        Float donations = 0f;
        for(Donation d: this.idea.getDonations()) {
            donations += d.getAmount();
        }
*/

        json = "{ \n" +
            "\"id\": \"" + idea.getId() + "\", \n" +
            "\"topic\": \"" + idea.getTitle() + "\", \n" +
            "\"interest\": \"" + idea.getInterest() + "\", \n" +
            "\"distribution\": \"" + idea.getDistribution() + "\", \n" +
            "\"investment\": \"" + idea.getInvestment() + "\", \n" +
            "\"direction\": \"right\", \n" +
            "\"selectedType\": \"" + idea.getIdeatype() + "\", \n" +
            "\"backgroundColor\": \"" + this.bg + "\", \n" +
            "\"logo\": \"" + image + "\", \n" +
            "\"logoContentType\": \"" + idea.getLogoContentType() + "\", \n" +
            "\"active\": \"" + idea.getActive() + "\", \n" +
            "\"income\": \"" + incomes + "\", \n" +
            "\"outgoing\": \"" + outgoings + "\", \n" +
            "\"donations\": \"" + donations + "\", \n" +
            "\"children\":" + children + "\n" +
            "}";
            return json;
    }
}
