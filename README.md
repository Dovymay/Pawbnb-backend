# 🐾 Pawbnb Backend API

Backend REST API for Pawbnb — a MERN application for booking pet stays.

🔗 **Live API:** https://pawbnb-backend-0ibv.onrender.com
🔗 **Frontend App:** https://pawbnbstays.netlify.app/

---

## 🚀 Tech Stack

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT Authentication
* bcrypt (password hashing)

---

## 🧠 API Overview

This API handles:

* User authentication & authorization
* Pet stay listings
* Booking system with availability logic

---

## 🔐 Authentication

JWT-based authentication is used.

Protected routes require:

```
Authorization: Bearer <token>
```

---

## 📦 Models

### User

* username
* email
* password (hashed)
* role (user / host)
* avatar

### PetStay

* title
* location
* pricePerNight
* rating
* reviews
* description
* image
* host (User reference)
* featured (Boolean)

### Booking

* user (User reference)
* petStay (PetStay reference)
* startDate
* endDate
* totalPrice (auto-calculated)
* status

---

## 📡 API Endpoints

### Auth

* `POST /auth/signup`
* `POST /auth/login`
* `GET /auth/verify`

### Pet Stays

* `GET /petstays`
* `GET /petstays/featured`
* `GET /petstays/:id`
* `GET /petstays/location/:city`
* `POST /petstays`
* `PUT /petstays/:id`
* `DELETE /petstays/:id`

### Bookings

* `GET /bookings`
* `GET /bookings/:id`
* `POST /bookings`
* `PUT /bookings/:id`
* `DELETE /bookings/:id`

---

## ⚙️ Setup

```bash
git clone https://github.com/Dovymay/Pawbnb-backend
cd Pawbnb-backend
npm install
```

Create `.env` file:

```
PORT=5005
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret
```

Run server:

```bash
npm run dev
```

---

## 🔄 Key Logic

### Booking Price Calculation

* Total price is calculated based on:

```
number_of_days × pricePerNight
```

### Availability Filtering

* Prevents overlapping bookings using date comparison
* Only returns available stays

---

## 📌 Notes

This API was built as part of a full-stack MERN project for the Ironhack Web Development Bootcamp.

---
