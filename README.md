# Online Food Delivery Order Manager 🍔

A smart dashboard application built with **React & Vite** to manage food delivery orders. This project solves a real-world problem: efficiently assigning the nearest available delivery partner to unpaid orders within a specific range.

## 🚀 Live Demo & Links
- **GitHub Repository:** [https://github.com/Gaurav874/Online-Food-Delivery-Order-Manager](https://github.com/Gaurav874/Online-Food-Delivery-Order-Manager.git)
- **Live Deployment:** *(Add your Vercel link here after deployment)*

---

## ✨ Key Features

### 1. 📝 Order Management
- **Add New Order:** Users can input Restaurant Name, Item Count, Distance (km), and Payment Status (Paid/COD).
- **Dynamic List:** Real-time update of orders in a clean, responsive table.
- **Status Badges:** Visual indicators for 'Paid' (Green) and 'Unpaid' (Red) statuses.

### 2. 🔍 Advanced Filtering
- **Status Filter:** Toggle visibility for Paid or Unpaid orders instantly.
- **Distance Slider:** Filter orders based on a maximum distance range (e.g., show orders only within 5km).

### 3. 🤖 Smart Delivery Assignment (Core Logic)
- The app features a custom algorithm to find the **"Best Match"** for delivery.
- **Logic:** It strictly selects orders that are **Unpaid** AND within the **selected distance**.
- **Optimization:** It automatically sorts eligible orders by distance and assigns the delivery to the nearest one.

### 4. 🎨 Modern UI/UX
- **Glassmorphism Design:** Translucent cards with blur effects.
- **Animations:** Smooth slide-up and fade-in effects on page load.
- **Interactive Elements:** Custom styled sliders, dropdowns, and hover effects.

---

## 🛠️ Tech Stack Used

- **Frontend Library:** React.js (Vite)
- **Language:** JavaScript (ES6+)
- **Styling:** Custom CSS3 (Variables, Flexbox, Grid, Animations)
- **Icons:** Lucide-React
- **Version Control:** Git & GitHub

---

## 🧠 How It Works (The Logic)

The core functionality lies in the `assignDelivery` function. Here is the step-by-step approach used to build it:

1.  **State Management:** I used `useState` to handle the list of orders (`orders`) and form inputs (`form`).
2.  **Filtering Phase:** When the "Find Nearest" button is clicked, the code first filters the main array to find orders that are:
    * Status === `Unpaid`
    * Distance <= `Max Distance (Slider Value)`
3.  **Sorting Phase:** If eligible orders are found, the JavaScript `.sort()` method arranges them in ascending order of distance (Nearest to Farthest).
4.  **Assignment Phase:** The first element (`index 0`) of the sorted array is selected as the best candidate for delivery.

---

## 💻 Installation & Setup Steps

If you want to run this project locally on your machine, follow these steps:

**Step 1: Clone the Repository**
```bash
git clone [https://github.com/Gaurav874/Online-Food-Delivery-Order-Manager.git](https://github.com/Gaurav874/Online-Food-Delivery-Order-Manager.git)
cd food-delivery-manager