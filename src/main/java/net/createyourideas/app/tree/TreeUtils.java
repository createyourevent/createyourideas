package net.createyourideas.app.tree;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class TreeUtils {

    private static Map<String, Node> nodeTree = new HashMap<>();

    public static Map<String, Node> getNodeTree() {
        return nodeTree;
    }

     //Public method to create the ideafunnel-tree (node-tree)
     public static void createTree(List<Node> nodes) {

        //Save all nodes to a map
        for (Node current : nodes) {
            nodeTree.put(current.getId(), current);
        }

        //loop and assign parent/child relationships
        for (Node current : nodes) {
            String parentId = current.getParentId();

            if (parentId != null) {
                Node parent = nodeTree.get(parentId);
                if (parent != null) {
                    current.setParent(parent);
                    parent.addChild(current);
                    nodeTree.put(parentId, parent);
                    nodeTree.put(current.getId(), current);
                }
            }

        }
    }

    public static String getIdeaFunnelJSON() {
        Node root = getRoot();
        return root.toString();
    }

    public static Node getRoot() {
        //get the root
        Node root = null;
        for (Node node : nodeTree.values()) {
            if(node.getParent() == null) {
                root = node;
                break;
            }
        }
        return root;
    }

    public static Node getNode(Long id) {
        Node node = nodeTree.get(id.toString());
        return node;
    }

    public static Integer getDepth(Long id) {
        Integer depth = 0;
        Node node = getNode(id);
        if(node.getIdea().getId() == 1) {
            depth = 0;
        } else {
            Node parent = node;
            while(parent.getParent() != null) {
                depth++;
                parent = parent.getParent();
            }
        }
        return depth;
    }

    public static List<Node> getDeepestChildren() {
        //get the root
        Node root = null;
        for (Node node : nodeTree.values()) {
            if(node.getParent() == null) {
                root = node;
                    break;
            }
        }
        List<Node> childrenFromRoot = getAllChild(root.getId());
        List<Node> lastChildren = new ArrayList<Node>();
        for(Node child : childrenFromRoot) {
            if(child.getChildren().size() == 0) {
                lastChildren.add(child);
            }
        }
        return lastChildren;
    }

    public static List<Node> getAllChild(String id) {
        Node node = nodeTree.get(id);
        List<Node> children = node.getChildren();
        List<Node> allChildren = new ArrayList<Node>();
        for (Node n : children) {
            allChildren.add(n);
        }
        for(Node n : children) {
            getChildren(n.getChildren(), allChildren);
        }
        return allChildren;
    }

    private static void getChildren(List<Node> children, List<Node> nodes) {
        for(Node child : children) {
            if(child.getChildren() != null) {
                getChildren(child.getChildren(), nodes);
            }
            nodes.add(child);
        }
    }
}
