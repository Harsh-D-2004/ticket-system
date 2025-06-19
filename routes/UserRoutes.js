import express from "express";
import UserController from "../controller/UserController.js";

const router = express.Router();

router.get("/register", UserController.showRegister);
router.post("/register", UserController.register);

router.get("/login", UserController.showLogin);
router.post("/login", UserController.login);

router.get("/createTicket", UserController.showCreateTicket);
router.post("/createTicket", UserController.createTicket);

router.get("/showCustomerDashboard", UserController.showCustomerDashboard);
router.get("/showAdminDashboard", UserController.showAdminDashboard);
router.get("/showAgentDashboard", UserController.showAgentDashboard);

router.get("/showUpdateTicket/:ticketId", UserController.showUpdateTicket);
router.post("/UpdateTicket/:ticketId", UserController.updateTicket);

export default router;