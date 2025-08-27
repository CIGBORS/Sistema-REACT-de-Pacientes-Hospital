import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Mainpage from './Components/Mainpage.jsx'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './index.css'
import Login from './Components/Login/Login.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/Mainpage",
    element: <Mainpage />,
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
