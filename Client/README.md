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
- **localStorage** for offline progress storage.
- **Service Workers** for caching and push notifications.
- **Bootstrap** for responsive UI design.
- **MongoDB** for data persistence.

## Project Structure

### **Backend (Server & API)**
- **/server/data/**  Stores `treeData.json` (Quran reading plan)
- **/server/controllers/**  Handles API requests (`treeController.mjs`)
- **/server/routes/** API endpoints (`treeRoutes.mjs`)
- **/server/server.mjs** Main server file (Express API & server setup)


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


## Render Production URL:
- Live Demo of the API: **[https://demo25-copy.onrender.com](https://demo25-copy.onrender.com)**
