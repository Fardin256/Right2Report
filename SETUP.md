# RTR - Report The Road 🚦

## Quick Setup Guide

### Step 1: Configure Environment Variables

Open `backend/.env` and fill in:

```
MONGO_URI=mongodb+srv://<YOUR_USERNAME>:<YOUR_PASSWORD>@cluster0.7pi0bls.mongodb.net/rtrdb?retryWrites=true&w=majority&appName=Cluster0

EMAIL_USER=your_gmail@gmail.com
EMAIL_PASSWORD=ixmc qsjg napi jmlr
```

> Keep CLOUDINARY values as-is, they are already configured.

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 3: Seed Authority Data into MongoDB

```bash
cd backend
node seedAuthorities.js
```

This inserts authority data for: Delhi, Noida, Mumbai, Bangalore, Hyderabad, Chennai, Gurgaon.

### Step 4: Start Backend

```bash
cd backend
npm run dev
```

### Step 5: Install & Start Frontend

```bash
cd rtr
npm install
npm run dev
```

### Step 6: Open App

Go to: http://localhost:5173

---

## Features Implemented

- ✅ User Register & Login (JWT)
- ✅ Protected Routes
- ✅ Report Issue with image upload (Cloudinary)
- ✅ Auto location detection + reverse geocoding
- ✅ Auto AI issue detection (Cloudinary tags)
- ✅ Fetch responsible department
- ✅ Email sent to authority with image (Nodemailer)
- ✅ Complaint stored in MongoDB Atlas
- ✅ Interactive Dashboard with stats
- ✅ Complaint history cards (expandable)
- ✅ Success screen after submission
