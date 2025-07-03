import fetch from 'node-fetch';
import { sql } from '@vercel/postgres';

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

    // Create messages table if it doesn't exist
    console.log('Creating/checking messages table...');
    await sql`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        surname VARCHAR(255),
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        email_sent BOOLEAN DEFAULT FALSE
      )
    `;
    console.log('Messages table ready');

    // Insert message into database
    console.log('Inserting message into database...');
    const result = await sql`
      INSERT INTO messages (name, surname, email, phone, message)
      VALUES (${name}, ${surname || ''}, ${email}, ${phone || ''}, ${message})
      RETURNING id, created_at
    `;
    console.log('Message inserted successfully');

    const messageId = result.rows[0].id;
    const createdAt = result.rows[0].created_at;

    // Send email via EmailJS API
    console.log('Sending email via EmailJS...');
    const emailSent = await sendEmailViaEmailJS({
      user_name: name,
      user_surname: surname || '',
      user_email: email,
      user_Number: phone || '',
      message: message
    });
    console.log('Email send result:', emailSent);

    // Update database with email status
    if (emailSent) {
      await sql`
        UPDATE messages 
        SET email_sent = true 
        WHERE id = ${messageId}
      `;
      console.log('Database updated with email status');
    }

    return res.status(200).json({
      success: true,
      message: 'Message received and processed successfully.',
      data: {
        id: messageId,
        emailSent: emailSent,
        createdAt: createdAt
      }
    });

  } catch (error) {
    console.error('Error processing message:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error. Please try again later.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
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
