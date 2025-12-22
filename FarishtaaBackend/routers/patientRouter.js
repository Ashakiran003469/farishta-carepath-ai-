const express=require('express');
const patientRouter=express.Router();
const patientController=require('../controllers/patientController');

patientRouter.post('/symptoms/:userId',patientController.postSymptomChecker);

patientRouter.get('/symptoms/:userId',patientController.getPreviousChats);

    module.exports=patientRouter;