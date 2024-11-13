import React from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ReactDOM from 'react-dom/client'
import AppBar from './AppBar.tsx'
import { App } from './App.tsx'
import './index.css'
import { Articles } from './Articles.tsx';
import { UserProvider } from './context/UserContext.tsx';
import { AddCourse } from './AddCourse.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <UserProvider>
      <AppBar></AppBar>
      <Routes>
        <Route path="/" element={<Articles />}></Route>
        <Route path="/app" element={<App />}></Route>
        <Route path="/articles" element={<Articles />}></Route>
        <Route path="add-course" element={<AddCourse />}></Route>
      </Routes>
      </UserProvider>
    </Router>
  </React.StrictMode>,
)
