# Ramadan Quran Reading Tracker -  Progressive Web App (PWA) 

## Description
This project is a **Progressive Web App (PWA)** that helps users **track their Quran reading progress during Ramadan**. It provides a structured reading plan, allows progress tracking with checkboxes, and ensures **offline support using localStorage**. Users can receive daily notifications to stay consistent with their Quran reading.


### How It Works
The Quran has 600 pages, so to complete it in 30 days, users can choose their goal and follow a structured plan.

### Pages to Read Per Day Based on Completion Goals  
- **1 Completion** → 20 pages/day  
- **2 Completions** → 40 pages/day  
- **3 Completions** → 60 pages/day  
- **5 Completions** → 100 pages/day  
- **10 Completions** → 200 pages/day  

The application is built with:
- **Node.js + Express** for the API and backend.
- **PostgreSQL** for data persistence (**Previously MongoDB**).
- **localStorage** for offline progress storage.
- **Service Workers** for caching and push notifications.
- **Bootstrap** for responsive UI design.

## Project Structure

### **Backend (Server & API)**
- **/server/db.js**  PostgreSQL connection setup using `pg` package.
- **/server/controllers/**  Handles API requests (`treeController.mjs`)
- **/server/routes/** API endpoints (`treeRoutes.mjs`)
- **/server/server.mjs** Main server file (Express API & server setup)
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


###  **Features**
**Quran Reading Plan**: Users can select how many times they want to complete the Quran during Ramadan and get a structured reading plan.  
**Progress Tracking**: Checkboxes to mark completed reading days, with **progress stored in localStorage**.
**Tree Data Structure**: A hierarchical structure organizes the reading plan by days and completion goals.  
**CRUD Operations**: Users can track, update, and reset their progress.  

## Pwa Features
**Offline Mode**: The app loads the reading plan from **localStorage when offline**.
**Installable**: Users can **install** the app on their device like a native app.  
**Push Notifications**: Sends **daily reminders** to encourage Quran reading.  
**Fast and Responsive**: Uses **Service Workers** to cache static assets, reducing load times.  


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


## Render Production URL:
- Live Demo of the API: **[https://demo25-copy.onrender.com](https://demo25-copy.onrender.com)**



### **API test with Postman**

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
