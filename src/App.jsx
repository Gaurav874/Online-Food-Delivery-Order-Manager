import { useState } from 'react';
import { Truck, MapPin, CheckCircle, XCircle, Plus, Filter } from 'lucide-react';
import './App.css';

function App() {
  // --- STATE MANAGEMENT ---
  
  const [orders, setOrders] = useState([
    { orderId: 101, restaurantName: "Burger King", dish: "Whopper Burger", itemCount: 2, deliveryDistance: 3.5, isPaid: false },
    { orderId: 102, restaurantName: "Dominos", dish: "Farmhouse Pizza", itemCount: 1, deliveryDistance: 8.0, isPaid: true },
    { orderId: 103, restaurantName: "KFC", dish: "Chicken Bucket", itemCount: 4, deliveryDistance: 2.1, isPaid: false },
  ]);

  const [form, setForm] = useState({
    restaurantName: '',
    dish: '',
    itemCount: '',
    deliveryDistance: '',
    isPaid: 'false'
  });

  const [maxDistance, setMaxDistance] = useState(10);
  const [showPaid, setShowPaid] = useState(true);
  const [showUnpaid, setShowUnpaid] = useState(true);
  const [assignment, setAssignment] = useState(null);

  // --- HANDLERS & LOGIC ---

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addOrder = (e) => {
    e.preventDefault();
    
    // Basic validation
    if(!form.restaurantName || !form.dish || !form.itemCount || !form.deliveryDistance) {
      alert("Please fill all details!");
      return;
    }

    const newOrder = {
      orderId: Date.now(),
      restaurantName: form.restaurantName,
      dish: form.dish,
      itemCount: Number(form.itemCount),
      deliveryDistance: Number(form.deliveryDistance),
      isPaid: form.isPaid === 'true'
    };

    setOrders([...orders, newOrder]);
    // Reset form
    setForm({ restaurantName: '', dish: '', itemCount: '', deliveryDistance: '', isPaid: 'false' });
  };

  // Assigns delivery to the nearest unpaid order
  const assignDelivery = () => {
    // Step 1: Filter eligible orders (Unpaid + Within Range)
    const eligibleOrders = orders.filter(order => 
      order.isPaid === false && order.deliveryDistance <= maxDistance
    );

    if (eligibleOrders.length === 0) {
      setAssignment({ success: false, msg: "❌ No order available" });
      return;
    }

    // Step 2: Sort by distance (Nearest first)
    eligibleOrders.sort((a, b) => a.deliveryDistance - b.deliveryDistance);
    
    // Step 3: Assign to the best match
    const bestMatch = eligibleOrders[0];
    
    setAssignment({ 
      success: true, 
      msg: `✅ Assigned to Order #${bestMatch.orderId}: ${bestMatch.itemCount}x ${bestMatch.dish} from ${bestMatch.restaurantName} (${bestMatch.deliveryDistance}km)` 
    });
  };

  const displayedOrders = orders.filter(order => {
    return (order.isPaid && showPaid) || (!order.isPaid && showUnpaid);
  });

  // --- UI RENDER ---
  return (
    <div className="dashboard-container">
      <header className="app-header">
        <h1><Truck className="icon-lg"/> Online Food Delivery Manager</h1>
      </header>

      <div className="main-layout">
        
        {/* PANEL 1: ADD ORDER FORM */}
        <div className="card form-card">
          <h2><Plus size={20}/> Add New Order</h2>
          <form onSubmit={addOrder}>
            <div className="input-group">
              <label>Restaurant Name</label>
              <input 
                type="text" name="restaurantName" 
                value={form.restaurantName} onChange={handleInput} 
                placeholder="e.g. Burger King" 
              />
            </div>

            <div className="input-group">
              <label>Dish Name</label>
              <input 
                type="text" name="dish" 
                value={form.dish} onChange={handleInput} 
                placeholder="e.g. Cheese Pizza" 
              />
            </div>
            
            <div className="row">
              <div className="input-group">
                <label>Item Count</label>
                <input 
                  type="number" name="itemCount" 
                  value={form.itemCount} onChange={handleInput} 
                  placeholder="0" 
                />
              </div>
              <div className="input-group">
                <label>Distance (km)</label>
                <input 
                  type="number" name="deliveryDistance" 
                  value={form.deliveryDistance} onChange={handleInput} 
                  placeholder="0.0" 
                />
              </div>
            </div>

            <div className="input-group">
              <label>Payment Status</label>
              <select name="isPaid" value={form.isPaid} onChange={handleInput}>
                <option value="false">🔴 Unpaid (COD)</option>
                <option value="true">🟢 Paid (Online)</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary">Add Order</button>
          </form>
        </div>

        {/* PANEL 2: ORDERS LIST TABLE */}
        <div className="card list-card">
          <div className="card-header">
            <h2>All Orders View ({displayedOrders.length})</h2>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Restaurant</th>
                  <th>Dish</th>
                  <th>Item Count</th>
                  <th>Distance</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {displayedOrders.map(order => (
                  <tr key={order.orderId}>
                    <td>#{order.orderId.toString().slice(-4)}</td>
                    <td>{order.restaurantName}</td>
                    <td><strong>{order.dish}</strong></td>
                    <td>{order.itemCount}</td>
                    <td><MapPin size={14}/> {order.deliveryDistance} km</td>
                    <td>
                      <span className={`badge ${order.isPaid ? 'paid' : 'unpaid'}`}>
                        {order.isPaid ? 'Paid' : 'Unpaid'}
                      </span>
                    </td>
                  </tr>
                ))}
                {displayedOrders.length === 0 && (
                  <tr><td colSpan="6" className="empty-msg">No orders found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PANEL 3: LOGIC & ASSIGNMENT */}
        <div className="card logic-card">
          <h2><Filter size={20}/> Filter & Assign</h2>
          
          <div className="filter-section">
            <label className="checkbox-label">
              <input type="checkbox" checked={showPaid} onChange={e => setShowPaid(e.target.checked)} />
              Show Paid
            </label>
            <label className="checkbox-label">
              <input type="checkbox" checked={showUnpaid} onChange={e => setShowUnpaid(e.target.checked)} />
              Show Unpaid
            </label>
            
            <div className="range-group">
              <label>Max Distance: <strong>{maxDistance} km</strong></label>
              <input 
                type="range" min="1" max="20" 
                value={maxDistance} onChange={e => setMaxDistance(Number(e.target.value))} 
              />
            </div>
          </div>

          <div className="action-section">
            <button onClick={assignDelivery} className="btn btn-action">
              Find Nearest Unpaid Delivery
            </button>

            {assignment && (
              <div className={`result-box ${assignment.success ? 'success' : 'error'}`}>
                {assignment.success ? <CheckCircle size={20}/> : <XCircle size={20}/>}
                <p>{assignment.msg}</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;