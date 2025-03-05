# Ramadan Quran Reading Tracker -  Progressive Web App (PWA) 

## Description
This project is a **Progressive Web App (PWA)** that helps users **track their Quran reading progress during Ramadan**. It provides a structured reading plan, allows progress tracking with checkboxes, and ensures **offline support using IndexedDB**. Users can receive **daily notifications** to stay consistent with their Quran reading.

### How It Works
The Quran has **600 pages**, so to complete it in **30 days**, users can choose their goal and follow a structured plan.

### Pages to Read Per Day Based on Completion Goals  
- **1 Completion** → 20 pages/day  
- **2 Completions** → 40 pages/day  
- **3 Completions** → 60 pages/day  
- **5 Completions** → 100 pages/day  
- **10 Completions** → 200 pages/day  

The application is built with:
- **Node.js + Express** for the API and backend.
- **IndexedDB** for offline progress storage.
- **Service Workers** for caching and push notifications.
- **Bootstrap** for responsive UI design.
- **MongoDB** for data persistence.

## Project Structure

### **Backend (Server & API)**
- **/localLibrary/data**: Contains the tree data structure (`treeData.mjs`)
- **/localLibrary/controllers**: Handles CRUD operations (`treeController.mjs`)
- **/localLibrary/routes**: Defines API endpoints (`treeRoutes.mjs`)
- **/localLibrary/api-tests**: Postman API testing setup (`LocalLibrary.postman_collection.json`)
- **/localLibrary/server.mjs**: Main server file (Express API & server setup)

### **Frontend (PWA & User Interface)**
- **/public/index.html**: Main user interface
- **/public/app.mjs**: Fetches reading data & syncs with IndexedDB
- **/public/idb.js**: Manages offline progress tracking via IndexedDB
- **/public/sw.js**: Service Worker for caching & notifications
- **/public/manifest.json**: Enables PWA installability
- **/public/favicon.ico**: App icon
- **/public/icons/**: Contains app icons (`192x192`, `512x512`)

### **Styles & Assets**
- **/public/css/bootstrap.min.css**: Bootstrap UI framework
- **/public/css/styles.css**: Custom styles for the Quran tracker

### **Project Setup & Dependencies**
- **server.mjs**: Express server & API setup
- **package.json**: Project dependencies & scripts
- **package-lock.json**: Dependency lock file
- **README.md**: Documentation for the project


###  **Core Features**
**Quran Reading Plan**: Users can select how many times they want to complete the Quran during Ramadan and get a structured reading plan.  
**Tree Data Structure**: A hierarchical structure organizes the reading plan by days and completion goals.  
**CRUD Operations**: Users can track, update, and reset their progress.  


## Pwa Features
**Offline Mode**: Uses **IndexedDB** to store Quran reading plans so users can continue tracking even without an internet connection.  
**Installable**: Users can **install** the app on their device like a native app.  
**Push Notifications**: Sends **daily reminders** to encourage Quran reading.  
**Fast and Responsive**: Uses **Service Workers** to cache static assets, reducing load times.  


##  **How It Works**
### 1. Select Your Completion Goal
- The user chooses how many times they want to **complete the Quran** in Ramadan.
- The app **generates a structured reading plan** with the required daily pages.

### 2. Track & Update Progress
- Users can **mark pages as completed**, update progress, or **reset** the plan.
- Data is **stored in IndexedDB**, so even if the internet is disconnected, progress is saved.
- **The app displays the reading plan correctly**:
  The user can check off completed days.  
  Checked items remain checked when refreshing (**progress is saved in IndexedDB**).

###  3. Offline Support
- When offline, the app loads from **IndexedDB** instead of making an API call.
- The reading plan is always **available** even with no internet.

### 4. Daily Notifications
- Users receive **automatic reminders** to stay consistent with their reading.
- Uses **Service Workers** to send daily push notifications.


## Render Production URL:
- Live Demo of the API: **[https://demo25-copy.onrender.com](https://demo25-copy.onrender.com)**
