//REQUIRING EXPRESS
const express = require("express");
const { manageRoles_post, manageRoles_get } = require("../controllers/manageRoles");
const { 
    createProject_get, 
    createProject_post, 
    myProject_get, 
    projectdetails_get, 
    deleteproject_delete, 
    editproject_get, 
    editproject_post
} = require("../controllers/projectController");

const { 
    createTicket_get,
    createTicket_post,
    mytickets_get,
    ticketdetails_get,
    deleteticket_delete,
    createComment_post,
    editTicket_post,
    editTicket_get
} = require('../controllers/ticketController');
const {
    profile_get,
    editProfile_post 
} = require('../controllers/profileController');


//USING EXPRESS MODEL ROUTER
const router = express.Router();
const {requireAuth } = require('../middlewares/authMiddleware');



router.get("/home", requireAuth  ,(req, res) => {
    res.render("home", { title: "Home" });
});
router.get("/manage-roles", requireAuth, manageRoles_get);
router.post("/manage-roles", requireAuth, manageRoles_post);
router.get("/myprojects", requireAuth , myProject_get);
router.get("/createproject", requireAuth,createProject_get);
router.post("/createproject", requireAuth, createProject_post);
router.get("/projectdetail/:id", requireAuth, projectdetails_get);
router.delete("/deleteproject/:id", requireAuth, deleteproject_delete);
router.get("/createticket/:id", requireAuth, createTicket_get);
router.get("/editproject/:id", requireAuth, editproject_get);
router.post("/editproject/:id", requireAuth, editproject_post);
router.get("/mytickets", requireAuth, mytickets_get);
router.post("/createticket/:id", requireAuth ,createTicket_post);
router.get("/ticketdetail/:id", requireAuth, ticketdetails_get);
router.delete("/deleteticket/:id", requireAuth, deleteticket_delete);
router.post("/createcomment/:id", requireAuth ,createComment_post);
router.get("/editticket/:id", requireAuth, editTicket_get);
router.post("/editticket/:id", requireAuth, editTicket_post);
router.get("/userprofile", requireAuth, profile_get);
router.post("/editprofile", requireAuth, editProfile_post);

module.exports = router;