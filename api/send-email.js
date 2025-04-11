export default async function handler(req, res) {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).json({ message: "Method Not Allowed" });
    }
  
    try {
      console.log("Request received with body:", req.body);
      const { name, surname, email, number, message } = req.body;
  
      if (!name || !surname || !email || !number || !message) {
        return res.status(400).json({ message: "Missing required fields" });
      }
  
      const payload = {
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID,
        user_id: process.env.EMAILJS_USER_ID,
        template_params: {
          user_name: name,
          user_surname: surname,
          user_email: email,
          user_Number: number,
          message: message
        }
      };
  
      const response = await fetch(
        "https://api.emailjs.com/api/v1.0/email/send",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      );
  
      if (!response.ok) {
        const errorData = await response.text();
        return res
          .status(response.status)
          .json({ message: "Email sending failed", error: errorData });
      }
  
      return res.status(200).json({ message: "Email sent successfully!" });
    } catch (err) {
      console.error("Error in send-email handler:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }