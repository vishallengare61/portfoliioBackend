

import { Router } from 'express';
import { createMessage } from './Contact.controller.js';

const ContactRoute = Router();

ContactRoute.post('/', createMessage)
ContactRoute.get('/', (req, res)=>{
    try {
        res.json({message: 'API WORKING!!'})
    } catch (err) {
        res.status(500).json({message: err})
    }
})


export default ContactRoute;