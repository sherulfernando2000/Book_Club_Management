import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './router.tsx'
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    
     <AuthProvider>
          <Toaster />
          <RouterProvider router={router}></RouterProvider>
     </AuthProvider>
  
  </StrictMode>,
)
