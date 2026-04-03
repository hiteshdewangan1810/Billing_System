#🧾 INVOICE APPLICATION
🚀 Create Professional Invoices Easily

A full-stack Invoice Management System built with React (Vite), Node.js, Express, and MySQL.
This app allows users to generate invoices, manage items, and calculate totals automatically.


✨ FEATURES

  ✅ Create invoices with customer details
  ✅ Add multiple items dynamically
  ✅ Auto calculation of total amount
  ✅ GST (%) support per item
  ✅ Delete items instantly
  ✅ Backend API integration
  ✅ Data stored in MySQL database


database

🛠️ TECH STACK
    -🎨 Frontend
    -⚛️ React (Vite)
    -🟨 JavaScript
    -🎨 CSS
⚙️ Backend
    -🟢 Node.js
    -🚏 Express.js
🗄️ Database
    -🐬 MySQL

📂 PROJECT STRUCTURE
    TASK/
    │── frontend/        # React App (Vite)
    │── backend/         # Node.js Backend
    │   ├── routes/
    │   │   └── invoiceRoutes.js
    │   ├── db.js
    │   └── server.js


⚙️ INSTALLATION & SETUP
🔽 1. Clone Repository
      git clone https://github.com/hiteshdewangan1810/Billing_System.git
      cd Billing_System

🖥️ 2. Backend Setup
      cd backend
      npm install
      npm start
   👉 Runs on: http://localhost:5000

🌐 3. Frontend Setup
      cd frontend
      npm install
      npm run dev
   👉 Runs on: http://localhost:5174   


🔗 API ENDPOINTS
      Method	Endpoint	Description
      POST	/api/invoices	Create Invoice
      GET	/api/invoices	Get All Invoices
      GET	/api/invoices/:id	Get Single Invoice

⚠️ IMPORTANT FIX (404 ERROR)
    If you face error while submitting invoice, update Axios:

    axios.post("http://localhost:5000/api/invoices", data);

📸 SCREENSHOT

![App Screenshot](./assets/billing.png)




🚀 FUTURE IMPROVEMENTS

  ✨ PDF Download
  🔐 Authentication (Login/Register)
  📊 Dashboard Analytics
  ✏️ Edit & Update Invoice
  ☁️ Deployment (Vercel / Render)



👨‍💻 AUTHOR
🙋‍♂️ Hitesh Dewangan

🔗 GitHub: https://github.com/hiteshdewangan1810
⭐ Support

  If you like this project, give it a ⭐ on GitHub!
