require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/Auth');
const aiRoutes = require('./routes/Ai'); 
const bookRoutes = require('./routes/Books'); 
const userRoutes = require('./routes/UserRoutes'); 

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);  
app.use('/api/ai', aiRoutes);     
app.use('/api/books', bookRoutes); 
app.use('/api/user', userRoutes); 

app.get('/health', (req, res) => {
  res.status(200).send('Server is up and running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
