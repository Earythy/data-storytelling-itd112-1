import { initializeApp } from 'firebase/app';
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

const firebaseConfig = {
  apiKey: "AIzaSyBEKKXD0Tv-W4G77w2h4w6SJI1o1Ky3h4Y",
  authDomain: "data-storytelling-itd112.firebaseapp.com",
  projectId: "data-storytelling-itd112",
  storageBucket: "data-storytelling-itd112.appspot.com",
  messagingSenderId: "331740563793",
  appId: "1:331740563793:web:bbd84d1eff8bcc2417eb70"
};

// Initialize firebase app
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(firebaseApp);

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
