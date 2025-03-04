import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import ContactRoute from './Contact/Contact.route.js';

const app = express();

// ✅ Allow only your frontend Vercel URL
// app.use(cors({
//   origin: 'http://localhost:3000',
//   // origin: 'https://portfolio-q2ehcspj6-vishals-projects-1e808cc8.vercel.app',
//   methods: ['GET', 'POST', 'OPTIONS'], // ✅ Ensure OPTIONS is allowed for preflight
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

// ✅ Handle preflight requests
// app.options('*', cors());
app.use(cors())

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/message', ContactRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
