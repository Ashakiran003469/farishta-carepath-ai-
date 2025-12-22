const ENV=process.env.NODE_ENV || 'production'

require('dotenv').config({
  path : `.env.${ENV}`
});

const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const errorController=require('./controllers/errorController');
const patientRouter=require('./routers/patientRouter');
const authRouter=require('./routers/authRouter');
const mongoose=require('mongoose');
const MONGO_DB_URL=`mongodb+srv://Codaholic:${process.env.MONGO_DB_USERNAME}@${process.env.MONGO_DB_PASSWORD}.hy9pkfk.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority&appName=root`;
const cors=require('cors');
const { isLoggedIn, isPatient } = require('./middleware/auth');
const doctorRouter = require('./routers/doctorRouter');

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.use(cors());
app.use((req, res, next) => {
  console.log("Request Recieved", req.url, req.method, req.body);
  next();
});

app.use('/api/auth',authRouter);
app.use('/api/patient',isLoggedIn,isPatient,patientRouter);
app.use('/api/doctor',doctorRouter);

const PORT = process.env.PORT || 3001;



app.use(errorController.getError);

mongoose.connect(MONGO_DB_URL).then(() => {
app.listen(PORT, () => {
  console.log(`Server running at : http://localhost:${PORT}/`);
});
})





