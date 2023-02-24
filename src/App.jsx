import { useState } from 'react'
import './App.css'
import Header from './Components/Header'
import Body from './Components/Body'
import { createBrowserRouter } from 'react-router-dom';
import { db } from "./lib/Firebase"
import Chat from './Components/Chat';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';


function App() {
  const [docs,setDocs] = useState(null);
  useEffect(() => {
    const setDocs = async () => {

      const documentss = await fetchUsers();
      documents = documentss;
      router = createBrowserRouter(getOpenRoutes(documents));
      setDocs(documentss);
      
    };

  },[]);
  return ( docs ? ( 
    <div className='bg-gradient-to-b from-white to-orange-50 h-full'>
    <Header/>
    <Body/>
    </div>) : (<div>Loading...</div>)
  )
}
export let documents = null;
export let router = null;

export async function fetchUsers() {

    const itemsRef = collection(db, "routes");
    const items = await getDocs(itemsRef);  
    return items;


}

export async function setUsers(user,roomId,minutes,streamOpen,date) {
  await setDoc(doc(db, "routes", user.mail), {
    mail:user.mail,
    name:user.name,
    roomId:roomId,
    streamOpen:streamOpen,
    streamTotalMinutes:minutes,
    date:date
  });
}

function getOpenRoutes(docs) {
  if(!docs)
  {
    setTimeout(() => {
      return getOpenRoutes(documents);

    },1000);
  } else {
  const routes = [
    {
      path:"/",
      element:<App/>
    }
  ]

  const items = docs;
  items.docs.forEach((doc) => {
      routes.push({
        path:doc.data().name,
        element:<Chat user={doc.data()}/>
      });
  });
  
  return routes; 
  }
}

export default App

