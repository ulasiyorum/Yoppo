import React , { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { fetchUsers } from './App'
import './App.css'
import App from './App'
import Chat from './Components/Chat'
import { createBrowserRouter } from 'react-router-dom';
import { RouterProvider } from 'react-router-dom';
ReactDOM.createRoot(document.getElementById('root')).render(
    <Application/>,
)

export let documents = null;
export let router = null;

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

function Application() {

  const [loading,setLoading] = useState(true);
  const[docs,setDocs] = useState(null);

  useEffect(() => {
    const initDocs = async () => {

      const documentss = await fetchUsers();
      documents = documentss;
      router = createBrowserRouter(getOpenRoutes(documents));
      setDocs(documentss);
      
    };
    initDocs();
  },[]);


  const loadSite = () => {
    if(docs != null && docs.docs.length > 0)
    {
        setLoading(false);
    }
    else {
      setTimeout(() => {
        loadSite();
      },800)
    }
  }

  if(loading) {
    loadSite();
  }

  return (
    <React.StrictMode>
    { !loading ? (
    <RouterProvider router={router}/> ) : (<div>Loading</div>) }
    </React.StrictMode>

  );

}