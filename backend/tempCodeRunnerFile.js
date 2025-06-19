const express= require('express');
const pool=require('./db/db');
const path =require('path');
const cors=require('cors');
//const bodyParser=require ('body-parser');
const dotenv=require('dotenv');

dotenv.config();
const app=express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true
}));

app.get('/signin',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','signIn.html'));
})


app.post('/signin', (req, res) => {
  const { identifier, password } = req.body;
  
  // For now, just echo the input to test if it's working
  console.log('Sign In Attempt:', identifier, password);

  res.send('Sign in POST request received.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});