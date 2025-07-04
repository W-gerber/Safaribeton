import fetch from 'node-fetch';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed. Use POST.' 
    });
  }

  try {
    const { name, surname, email, phone, message } = req.body;

    // Log incoming request (for debugging)
    console.log('Received contact form submission:', { name, email, hasMessage: !!message });

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, email, and message are required.'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format.'
      });
    }

    // Insert message into database using Prisma
    console.log('Inserting message into database...');
    const newMessage = await prisma.message.create({
      data: {
        name,
        surname: surname || null,
        email,
        phone: phone || null,
        message
      }
    });
    console.log('Message inserted successfully');

    const messageId = newMessage.id;
    const createdAt = newMessage.createdAt;

    // Send email via EmailJS API
    console.log('Sending email via EmailJS...');
    const emailSent = await sendEmailViaEmailJS({
      user_name: name,
      user_surname: surname || '',
      user_email: email,
      user_Number: phone || '',
      message
    });
    console.log('Email send result:', emailSent);

    if (emailSent) {
      await prisma.message.update({
        where: { id: messageId },
        data: { emailSent: true }
      });
      console.log('Database updated with email status');
    }

    return res.status(200).json({
      success: true,
      message: 'Message received and processed successfully.',
      data: { id: messageId, emailSent, createdAt }
    });

  } catch (error) {
    console.error('Error processing message:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error. Please try again later.'
    });
  }
}

/**
 * Send email via EmailJS REST API
 */
async function sendEmailViaEmailJS(templateParams) {
  try {
    const emailJSUrl = 'https://api.emailjs.com/api/v1.0/email/send';
    
    const payload = {
      service_id: process.env.EMAILJS_SERVICE_ID,
      template_id: process.env.EMAILJS_TEMPLATE_ID,
      user_id: process.env.EMAILJS_PUBLIC_KEY,
      accessToken: process.env.EMAILJS_PRIVATE_KEY,
      template_params: templateParams
    };

    const response = await fetch(emailJSUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('EmailJS API error:', response.status, errorText);
      return false;
    }

    console.log('Email sent successfully via EmailJS');
    return true;

  } catch (error) {
    console.error('Error sending email via EmailJS:', error);
    return false;
  }
}
