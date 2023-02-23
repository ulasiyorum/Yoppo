import React , { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import App, { documents } from './App'
import './index.css'
import { RouterProvider } from 'react-router-dom';
import { router } from './App';
ReactDOM.createRoot(document.getElementById('root')).render(
    <Application/>,
)


function Application() {

  const [loading,setLoading] = useState(true);

  const loadSite = () => {
    
    if(documents.docs.length > 0)
    {
        setLoading(false);
    }
    else {
      setTimeout(() => {
        loadSite();
        console.log('test');
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