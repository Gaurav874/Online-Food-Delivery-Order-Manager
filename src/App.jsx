import { useState } from 'react';
import { Truck, MapPin, CheckCircle, XCircle, Plus, Filter } from 'lucide-react';
import './App.css';

function App() {
  // --- 1. STATE MANAGEMENT (Data Store) ---
  
  // Saare Orders yahan store honge
  const [orders, setOrders] = useState([
    { id: 101, restaurant: "Burger King", items: 2, distance: 3.5, isPaid: false },
    { id: 102, restaurant: "Dominos", items: 1, distance: 8.0, isPaid: true },
    { id: 103, restaurant: "KFC", items: 4, distance: 2.1, isPaid: false },
  ]);

  // Form ka data
  const [form, setForm] = useState({
    restaurant: '',
    items: '',
    distance: '',
    isPaid: 'false' // String mein store kar rahe hain initially
  });

  // Filter & Logic States
  const [maxDistance, setMaxDistance] = useState(10);
  const [showPaid, setShowPaid] = useState(true);
  const [showUnpaid, setShowUnpaid] = useState(true);
  const [assignment, setAssignment] = useState(null); // Result dikhane ke liye

  // --- 2. FUNCTIONAL LOGIC ---

  // Input Change Handle karna
  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Order Add karna
  const addOrder = (e) => {
    e.preventDefault(); // Page refresh hone se rokega
    
    // Validation: Agar kuch khali hai to roko
    if(!form.restaurant || !form.items || !form.distance) {
      alert("Please fill all details!");
      return;
    }

    const newOrder = {
      id: Date.now(), // Unique ID generate karega
      restaurant: form.restaurant,
      items: Number(form.items),
      distance: Number(form.distance),
      isPaid: form.isPaid === 'true' // String se Boolean convert logic
    };

    setOrders([...orders, newOrder]);
    // Form Reset
    setForm({ restaurant: '', items: '', distance: '', isPaid: 'false' });
  };

  // Delivery Assign karna (MAIN INTERVIEW LOGIC)
  const assignDelivery = () => {
    // Step 1: Sirf UNPAID orders dhundo jo Range mein hain
    const eligibleOrders = orders.filter(order => 
      order.isPaid === false && order.distance <= maxDistance
    );

    if (eligibleOrders.length === 0) {
      setAssignment({ success: false, msg: "❌ No unpaid orders found in this range." });
      return;
    }

    // Step 2: Distance ke hisab se Sort karo (Nearest First)
    eligibleOrders.sort((a, b) => a.distance - b.distance);

    // Step 3: Sabse pehla wala utha lo
    const bestMatch = eligibleOrders[0];
    setAssignment({ 
      success: true, 
      msg: `✅ Assigned to Order #${bestMatch.id} (${bestMatch.restaurant}) - ${bestMatch.distance}km away!` 
    });
  };

  // Table ke liye Filtered Data generate karna
  const displayedOrders = orders.filter(order => {
    const statusMatch = (order.isPaid && showPaid) || (!order.isPaid && showUnpaid);
    // Table me hum saare distance dikhayenge, bas filter status ka rakhenge visual ke liye
    // Lekin agar company bole distance bhi filter karo table me, to niche wali line uncomment kar dena
    // const distanceMatch = order.distance <= maxDistance; 
    return statusMatch; 
  });

  // --- 3. UI RENDER ---
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
                type="text" name="restaurant" 
                value={form.restaurant} onChange={handleInput} 
                placeholder="e.g. Burger King" 
              />
            </div>
            
            <div className="row">
              <div className="input-group">
                <label>Items (Qty)</label>
                <input 
                  type="number" name="items" 
                  value={form.items} onChange={handleInput} 
                  placeholder="0" 
                />
              </div>
              <div className="input-group">
                <label>Distance (km)</label>
                <input 
                  type="number" name="distance" 
                  value={form.distance} onChange={handleInput} 
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
                  <th>ID</th>
                  <th>Restaurant</th>
                  <th>Items</th>
                  <th>Distance</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {displayedOrders.map(order => (
                  <tr key={order.id}>
                    <td>#{order.id.toString().slice(-4)}</td>
                    <td>{order.restaurant}</td>
                    <td>{order.items}</td>
                    <td><MapPin size={14}/> {order.distance} km</td>
                    <td>
                      <span className={`badge ${order.isPaid ? 'paid' : 'unpaid'}`}>
                        {order.isPaid ? 'Paid' : 'Unpaid'}
                      </span>
                    </td>
                  </tr>
                ))}
                {displayedOrders.length === 0 && (
                  <tr><td colSpan="5" className="empty-msg">No orders found</td></tr>
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
              Show Paid (Green)
            </label>
            <label className="checkbox-label">
              <input type="checkbox" checked={showUnpaid} onChange={e => setShowUnpaid(e.target.checked)} />
              Show Unpaid (Red)
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