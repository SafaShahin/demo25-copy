# LocalLibrary API  - Now a Progressive Web App (PWA)

## Description
This project is a Progressive Web App (PWA) version of our Local Library API. The app allows users to interact with a tree-based data structure using a REST API, and now supports **offline functionality** **installability**, and **better client-side experience**.

The project is an Express application demonstrates an in-memory CRUD API for a tree data structure. The tree is used to represent hierarchical data and can be adapted for applications. I chose a tree structure because it allows me to represent hierarchical data (a node with child nodes) in a way that is both intuitive and scalable. This structure can be applied to a variety of applications (e.g., representing categories and subcategories, or organizational structures) and will be useful for further development.

## Project Structure
- **/localLibrary/data**: Contains the tree data structure (treeData.js)
- **/localLibrary/controllers**: Contains CRUD controller functions (treeController.js)
- **/localLibrary/routes**: Contains API route definitions (treeRoutes.js)
- **/localLibrary/api-tests**: Contains exported Postman/Insomnia collections for API testing
- **/localLibrary/server.mjs**: Main server file

## Pwa Features
**Offline Mode**: Uses a service worker (sw.js: handles offline caching)to cache static files(:Supports  index.html client.).
**Installable PWA**: (manifest.json: allows installation.)Users can install it on their device. 
**Fast**: Works when the user is offline.

## Render Production URL:
- Live Demo of the API: **[https://demo25-copy.onrender.com](https://demo25-copy.onrender.com)**
