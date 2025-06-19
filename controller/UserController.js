import UserService from "../service/UserService.js";
import Ticket from "../models/Ticket.js";
import User from "../models/User.js";

export function showRegister(req, res){
  res.render('register');
};

export function showLogin(req, res){
  res.render('login');
};

export async function register(req, res) {
  try {
    const user = req.body;
    const result = await UserService.registerUser(user);
    res.render("register", { success: "Registration successful!" });
  } catch (err) {
    res.render("register", { error: err.message });
  }
};

export async function login(req, res) {
  try {
    const user = req.body;
    const result = await UserService.loginUser(user);
    req.session.userId = result.userId;
    req.session.role = result.role;

    if(result.role == "customer"){
      res.redirect("/users/showCustomerDashboard");
    }
    else if(result.role == "agent"){
      res.redirect("/users/showAgentDashboard");
    }
    else if(result.role == "admin"){
      res.redirect("/users/showAdminDashboard");
    }
  } catch (err) {
    res.render("login", { error: err.message });
  }
};

export function showCreateTicket(req, res){
  res.render('createTicket');
};

export async function createTicket(req, res) {
  try {
    const ticket = req.body;
    const userId = req.session.userId
    const result = await UserService.createTicket(ticket , userId);
    req.session.ticketId = result.ticketId;
    res.render("createTicket", { success: "Ticket created successfully!" });
  } catch (err) {
    res.render("createTicket", { error: err.message });
  }
};

export async function showCustomerDashboard(req, res){
    const tickets = await Ticket.find({createdBy: req.session.userId});
    // const tickets = await Ticket.find({createdBy: "685256aba70d07bb9f2b85c2"});
    res.render('customerDashboard' , {tickets});
};

export async function showAdminDashboard(req, res){
    const tickets = await Ticket.find().populate("assignedTo");
    res.render('adminDashboard' , {tickets});
};

export async function showAgentDashboard(req, res) {
  try {
    const agentId = req.session.userId;
    const tickets = await Ticket.find({ assignedTo: agentId })
    res.render("agentDashboard", { tickets });
  } catch (err) {
    res.render("agentDashboard", { error: err.message });
  }
}

export async function showUpdateTicket(req, res){

    const ticket = await Ticket.findById(req.params.ticketId);
    const role = req.session.role;
    // const role = "admin";
    console.log(role);

    if(role == "admin"){
        const agents = await User.find({role: "agent"});
        res.render('updateTicket' , {ticket , role, agents});
    }
    else{
        res.render('updateTicket' , {ticket , role});
    }
}

export async function updateTicket(req, res) {
  try {
    const ticket = await Ticket.findById(req.params.ticketId);
    console.log(ticket);

    ticket.title = req.body.title;
    ticket.description = req.body.description;
    ticket.category = req.body.category;
    ticket.status = req.body.status;

    if (req.body.assignedTo) {
      console.log(req.body.assignedTo);
      const agent = await User.findById(req.body.assignedTo);
      if (!agent) throw new Error("Assigned agent not found");
      ticket.assignedTo = agent._id;
    }

    if (req.body.reply && req.body.reply.trim() !== "") {
      ticket.replies.push({
        message: req.body.reply,
        repliedBy: req.session.userId,
      });
    }
    
    if (ticket.status === "Resolved") {
      console.log("Ticket github issue id", ticket.githubIssueId);
      await UserService.closeGithubIssue(ticket.githubIssueId); 
      console.log("Ticket closed");
    } else if (ticket.status === "Open") {
      await UserService.openGithubIssue(ticket.githubIssueId);
      console.log("Ticket opened");
    }else if(ticket.status === "Closed"){
      await UserService.closeGithubIssue(ticket.githubIssueId); 
      console.log("Ticket closed");
    }

    await ticket.save();
    const role = req.session.role;
    if (role === "admin") {
      return res.redirect("/users/showAdminDashboard");
    } else if (role === "agent") {
      return res.redirect("/users/showAgentDashboard");
    }

    res.redirect("/");

  } catch (err) {
    console.error("Ticket update failed:", err);
    res.status(500).render("updateTicket", { error: err.message, ticket: {}, role: req.session.role });
  }
}


export default {
  showRegister,
  register,
  showLogin,
  login,
  showCreateTicket,
  createTicket,
  showCustomerDashboard,
  showAdminDashboard,
  showUpdateTicket,
  showAgentDashboard,
  updateTicket
};