import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAjpFQTgxB0CAUlM_P_v_po-OgxibsOQ0Q",
  authDomain: "data-visualization-itd112-it4d.firebaseapp.com",
  projectId: "data-visualization-itd112-it4d",
  storageBucket: "data-visualization-itd112-it4d.appspot.com",
  messagingSenderId: "984249307771",
  appId: "1:984249307771:web:585cfd41401636025108de",
  measurementId: "G-8HJ362DG3K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore
const db = getFirestore(app);

// Collection reference
const colRef = collection(db, 'dengue');

// Real-time collection data
const unsubscribe = onSnapshot(colRef, (snapshot) => {
  let dengue = [];
  snapshot.forEach((doc) => {
    dengue.push({ ...doc.data(), id: doc.id });
  });

  // Update the dashboard display
  updateDashboard(dengue);
});

// Deleting docs
window.deleteCase = async (id) => {
  if (confirm('Are you sure you want to delete this case?')) {
    try {
      await deleteDoc(doc(colRef, id));
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  }
};

// Adding docs
const addCaseForm = document.getElementById('addForm');
addCaseForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  try {
    await addDoc(colRef, {
      loc: addCaseForm.loc.value,
      cases: parseInt(addCaseForm.cases.value),
      deaths: parseInt(addCaseForm.deaths.value),
      reportedAt: addCaseForm.date.value,
      region: addCaseForm.region.value,
      createdAt: serverTimestamp(), // Automatically add timestamp
    });

    addCaseForm.reset();
  } catch (error) {
    console.error('Error adding document: ', error);
  }
});

