# Ramadan Quran Reading Tracker -  Progressive Web App (PWA) 

## Description
This project is a **Progressive Web App (PWA)** that helps users **track their Quran reading progress during Ramadan**. It provides a structured reading plan, allows progress tracking with checkboxes, and ensures **offline support using localStorage**. Users can receive daily notifications to stay consistent with their Quran reading.

## Pwa Features
**Offline Mode**: The app loads the reading plan from **localStorage when offline**.
**Installable**: Users can **install** the app on their device like a native app.  
**Push Notifications**: Sends **daily reminders** to encourage Quran reading.  
**Responsive**: Uses **Service Workers** to cache static assets, reducing load times. 


---


### How It Works
The Quran has 600 pages, so to complete it in 30 days, users can choose their goal and follow a structured plan.

### Pages to Read Per Day Based on Completion Goals  
- **1 Completion** → 20 pages/day  
- **2 Completions** → 40 pages/day  
- **3 Completions** → 60 pages/day  
- **5 Completions** → 100 pages/day  
- **10 Completions** → 200 pages/day  

###  **Features**
**Quran Reading Plan**: Users can select how many times they want to complete the Quran during Ramadan and get a structured reading plan.  
**Progress Tracking**: Checkboxes to mark completed reading days, with **progress stored in localStorage**.
**Tree Data Structure**: A hierarchical structure organizes the reading plan by days and completion goals.  
**CRUD Operations**: Users can track, update, and reset their progress.  
 


##  **How It Works**
### 1. Select Your Completion Goal
- The user chooses how many times they want to **complete the Quran** in Ramadan.
- The app **generates a structured reading plan** with the required daily pages.

### 2. Track & Update Progress
- Users can **mark pages as completed**.
- Progress is **saved in localStorage**, so it persists even after closing the browser.

###  3. Offline Support
- When offline, the app loads from **localStorage** instead of making an API call.
- The reading plan is **always available**.

### 4. Daily Notifications
- Users can **mark pages as completed**.
- Progress is **saved in localStorage**, so it persists even after closing the browser.



---



**Technology Stack**
### **Backend (API & Database)**
- **Node.js + Express**  Backend server & API routes.
- **PostgreSQL**  Database storing reading plans & user progress.
- **pgAdmin**  Tool for managing PostgreSQL database.
- **pg (node-postgres)**  PostgreSQL client for querying the database.

### **Frontend (PWA)**
- **Service Workers**  Enables offline support & push notifications.
- **localStorage**  Saves progress locally when offline.
- **Bootstrap**  Provides responsive UI.

## Project Structure

### **Backend (Server & API)**
- **/server/db.js**  PostgreSQL connection setup using `pg` package.
- **/server/models/Tree.mjs**  Handles database logic.
- **/server/routes/treeRoutes.mjs**  API endpoints.
- **/server/server.mjs**  Main server file (Express API & server setup).
- **/server/database/schema.sql**  Defines database structure.
- **/server/database/seed.sql**  Seeds initial data.
- **/server/data/** (Previously used for `treeData.json` before migration to PostgreSQL).


### **Frontend (PWA & User Interface)**
- **/Client/public/index.html**  Main user interface
- **/Client/public/app.mjs**  Fetches reading data & syncs with **localStorage**
- **/Client/public/sw.js**  Service Worker for caching & notifications
- **/Client/public/manifest.json**  Enables PWA installability
- **/Client/public/favicon.ico**  App icon
- **/Client/public/icons/**  App icons (`192x192`, `512x512`)

### **Styles & Assets**
- **/Client/public/css/bootstrap.min.css**: Bootstrap UI framework
- **/Client/public/css/styles.css**: Custom styles for the Quran tracker


---

##  **Render Deployment vs Local Testing**
This project is deployed using **Render**, and it can also be tested locally.

### **Render Deployment (Production)**
- **URL:** [https://demo25-copy.onrender.com](https://demo25-copy.onrender.com)
- **Purpose:** Allows users to access the Quran Reading Tracker as a **hosted web service**.
- **How it works:**
  - The server (`server.mjs`) runs on Render.
  - It connects to the **PostgreSQL database** (also hosted on Render).
  - Requests are served via the **API** (`/api/tree`).
  - The frontend fetches data from the **Render API**.

### **Local Testing (Development)**
- **URL:** `http://localhost:10000/api/tree`
- **Purpose:** Allows testing features before deploying to Render.
- **How it works:**
  - The server runs locally (`server.mjs`).
  - It connects to the **Render-hosted PostgreSQL database**.
  - API requests (`/api/tree`) are served locally.
  - Frontend fetches data from the **local API** (`http://localhost:10000/api/tree`).

---

## **Backend Migration: PostgreSQL Instead of MongoDB**
Initially, **MongoDB was used** because:
- It allowed **storing nested JSON structures**, which aligned well with the hierarchical reading plan format.
- It provided **flexibility in schema**, making it easy to adjust without strict table relationships.

However, **PostgreSQL was required**, as relational databases for:
- **Structured data with relationships** (Days & Goals → One-to-Many Relationship).
- **ACID compliance** (Ensuring reliable transactions).
- **Efficient querying using SQL**.

Thus, the data was normalized into two tables:  
`days` (Tracks each day in the reading plan).  
`goals` (Tracks goals for each day, linked by `day_id` foreign key).  

Now, all **CRUD operations are stored in PostgreSQL**, ensuring **persistent storage and better data integrity**.


##  **Database: PostgreSQL Setup**
The project uses PostgreSQL as the primary database.

### **Database Structure (Tables)**
 storing Quran reading progress using **three tables:**
- **`days`** Stores each day in the reading plan.
- **`goals`** Stores reading goals linked to specific days.
- **`sessions`** Manages user sessions manually.

### **PostgreSQL Database Connection**
The backend **(server.mjs)** connects to **Render's PostgreSQL database** using:
```js
const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});
```
### **process.env.DATABASE_URL** : Environment variable storing database credentials. 

### **ssl: { rejectUnauthorized: false }** : Required for secure PostgreSQL connections.

---

###  Instability

#### Local / Render :

- **Local** (`http://localhost:10000/api/tree`)
  - More stable, works on my computer.
  - Requires running the server manually.

- **Render** (`https://demo25-copy.onrender.com`)
  - Can be affected by Renders downtime.
  - May experience slower database queries compared to local.


### **API test with Postman**

To  test the API endpoints, the **`LocalLibrary.postman_collection.json`** file inside the **`Client/api-tests`** folder is used. This file is an **API collection** that can be **imported into Postman** for quick testing of the Quran Reading Tracker API.


#### Testing with curl -X GET http://localhost:10000/api/tree

#### **GET**
- Fetch entire plan: `GET http://localhost:10000/api/tree`
- Fetch specific day: `GET http://localhost:10000/api/tree/2`

#### **POST**
- Add goal to a day:  
  `json`
 `POST http://localhost:10000/api/tree/2`
  {
    "customGoal": "Read Surah Al-Kahf"
  }

#### **PUT**
- Update a day’s name:
`PUT http://localhost:10000/api/tree/2`
{
  "name": "Updated Day 2"
}

#### **DELETE**
Remove a goal: `DELETE http://localhost:10000/api/tree/2/12`
