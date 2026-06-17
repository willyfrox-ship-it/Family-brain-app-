import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, where, onSnapshot } from 'firebase/firestore';
import { Home, Wallet, Users, Heart, FileText, LogOut, Plus, Trash2, Check, ShoppingCart, Dog, ClipboardList, Zap, Calendar, MessageSquare } from 'lucide-react';
import './App.css';

const firebaseConfig = {
  apiKey: "AIzaSyBV1hAMqHSK-i1vDe1c0YpMzJ1i-b9K5uA",
  authDomain: "family-brain-5ce2f.firebaseapp.com",
  projectId: "family-brain-5ce2f",
  storageBucket: "family-brain-5ce2f.firebasestorage.app",
  messagingSenderId: "72751844190",
  appId: "1:72751844190:web:bfbd121a36964f6539ddcf"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Cargando...</div>;

  if (!user) return <LoginPage />;

  return <Dashboard user={user} />;
}

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async () => {
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '10px' }}>
      <h1 style={{ textAlign: 'center', color: '#2F6F5E', marginBottom: '30px' }}>Family Brain</h1>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ddd' }} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ddd' }} />
      {error && <p style={{ color: 'red', fontSize: '12px', marginBottom: '10px' }}>{error}</p>}
      <button onClick={handleAuth} style={{ width: '100%', padding: '10px', background: '#2F6F5E', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginBottom: '10px' }}>{isSignup ? 'Sign Up' : 'Sign In'}</button>
      <button onClick={() => setIsSignup(!isSignup)} style={{ width: '100%', padding: '10px', background: '#f0f0f0', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>{isSignup ? 'Already have account? Sign In' : "Don't have account? Sign Up"}</button>
    </div>
  );
}

function Dashboard({ user }) {
  const [tab, setTab] = useState('finances');
  const [finances, setFinances] = useState([]);
  const [kids, setKids] = useState([]);
  const [couple, setCouple] = useState([]);
  const [health, setHealth] = useState([]);
  const [shopping, setShopping] = useState([]);
  const [pets, setPets] = useState([]);
  const [chores, setChores] = useState([]);
  const [notes, setNotes] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [budget, setBudget] = useState([]);
  const [calendar, setCalendar] = useState([]);

  useEffect(() => {
    if (!user) return;
    loadAllData();
  }, [user]);

  const loadAllData = async () => {
    const collections = ['finances', 'kids', 'couple', 'health', 'shopping', 'pets', 'chores', 'notes', 'maintenance', 'inventory', 'budget', 'calendar'];
    const setters = { finances: setFinances, kids: setKids, couple: setCouple, health: setHealth, shopping: setShopping, pets: setPets, chores: setChores, notes: setNotes, maintenance: setMaintenance, inventory: setInventory, budget: setBudget, calendar: setCalendar };

    for (let col of collections) {
      const ref = await getDocs(collection(db, `users/${user.uid}/${col}`));
      setters[col](ref.docs.map(d => ({ id: d.id, ...d.data() })));
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f1e8' }}>
      <header style={{ background: '#2F6F5E', color: 'white', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Family Brain</h1>
        <button onClick={handleLogout} style={{ background: 'white', color: '#2F6F5E', border: 'none', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer' }}>Logout</button>
      </header>

      <nav style={{ display: 'flex', gap: '10px', padding: '15px', background: 'white', borderBottom: '1px solid #ddd', flexWrap: 'wrap' }}>
        {[
          { key: 'finances', label: 'Finanzas', icon: Wallet },
          { key: 'kids', label: 'Niños', icon: Users },
          { key: 'couple', label: 'Pareja', icon: Heart },
          { key: 'health', label: 'Salud', icon: ClipboardList },
          { key: 'shopping', label: 'Compras', icon: ShoppingCart },
          { key: 'pets', label: 'Mascotas', icon: Dog },
          { key: 'chores', label: 'Tareas', icon: Zap },
          { key: 'notes', label: 'Notas', icon: MessageSquare },
          { key: 'maintenance', label: 'Casa', icon: Home },
          { key: 'inventory', label: 'Inventario', icon: FileText },
          { key: 'budget', label: 'Presupuesto', icon: Wallet },
          { key: 'calendar', label: 'Calendario', icon: Calendar }
        ].map(item => (
          <button key={item.key} onClick={() => setTab(item.key)} style={{ padding: '8px 16px', background: tab === item.key ? '#2F6F5E' : '#f0f0f0', color: tab === item.key ? 'white' : '#333', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            {item.label}
          </button>
        ))}
      </nav>

      <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        {tab === 'finances' && <FinancesTab finances={finances} user={user} onAdd={loadAllData} />}
        {tab === 'kids' && <KidsTab kids={kids} user={user} onAdd={loadAllData} />}
        {tab === 'couple' && <CoupleTab couple={couple} user={user} onAdd={loadAllData} />}
        {tab === 'health' && <HealthTab health={health} user={user} onAdd={loadAllData} />}
        {tab === 'shopping' && <ShoppingTab shopping={shopping} user={user} onAdd={loadAllData} />}
        {tab === 'pets' && <PetsTab pets={pets} user={user} onAdd={loadAllData} />}
        {tab === 'chores' && <ChoresTab chores={chores} user={user} onAdd={loadAllData} />}
        {tab === 'notes' && <NotesTab notes={notes} user={user} onAdd={loadAllData} />}
        {tab === 'maintenance' && <MaintenanceTab maintenance={maintenance} user={user} onAdd={loadAllData} />}
        {tab === 'inventory' && <InventoryTab inventory={inventory} user={user} onAdd={loadAllData} />}
        {tab === 'budget' && <BudgetTab budget={budget} user={user} onAdd={loadAllData} />}
        {tab === 'calendar' && <CalendarTab calendar={calendar} user={user} onAdd={loadAllData} />}
      </main>
    </div>
  );
}

function FinancesTab({ finances, user, onAdd }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleAdd = async () => {
    if (!name || !amount) return;
    await addDoc(collection(db, `users/${user.uid}/finances`), { name, amount: parseFloat(amount), dueDate, date: new Date() });
    setName(''); setAmount(''); setDueDate('');
    onAdd();
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, `users/${user.uid}/finances`, id));
    onAdd();
  };

  return (
    <div style={{ background: 'white', padding: '20px', borderRadius: '10px' }}>
      <h2>Finanzas</h2>
      <div style={{ display: 'flex', ga
