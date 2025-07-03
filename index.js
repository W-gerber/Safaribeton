// This file ensures proper deployment structure for Vercel
// The actual website content is served from static files

module.exports = (req, res) => {
  res.status(200).json({ 
    message: 'Safari Beton API is running',
    timestamp: new Date().toISOString(),
    endpoints: {
      contact: '/api/sendMessage'
    }
  });
};
