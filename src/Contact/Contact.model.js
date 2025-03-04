

import { Schema, model } from "mongoose";

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validateMobile = (mobile) => {
    const mobileRegex = /^[0-9]{10}$/; 
    return mobileRegex.test(mobile);
};

const contactSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: validateEmail,
            message: (email)=>`${email.value} is not a valid email!`
        }
    },
    mobile: {
        type: Number,
        required: true,
        validate: {
            validator: validateMobile,
            message: (mobile)=>`${mobile.value} is not a valid mobile`
        }
    },
    message: {
        type: String,
        required: true,
    }
}, {timestamps: true});


const ContactModel = model('Contact', contactSchema);
export default ContactModel;