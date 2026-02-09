const express=require('express');
const dotenv=require('dotenv');
const mongoose=require('mongoose');
const registrationRouter=require('./router/registrationRouter');

dotenv.config();
const app=express();

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log('Connected to MongoDB');
}).catch((err)=>{
    console.error('Error connecting to MongoDB',err);
});

// Use registration router
app.use('/api/auth',registrationRouter);

app.get('/',(req,res)=>{
    res.send('server is running');
});

// Import routes
app.listen(process.env.PORT,()=>{
    console.log(`Server is running at http://localhost:${process.env.PORT}`);
}); 