SELECT id,
       name,
       surname,
       email,
       phone,
       message,
       "createdAt",
       "emailSent"
FROM public."Message"
LIMIT 1000;