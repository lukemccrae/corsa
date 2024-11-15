import React from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ReactDOM from 'react-dom/client'
import { Dashboard } from './Dashboard.tsx'
import { App } from './App.tsx'
import './index.css'
import { Articles } from './Articles.tsx';
import { UserProvider } from './context/UserContext.tsx';
import { AddCourse } from './AddCourse.tsx';
import { Footer } from './Footer.tsx';
import { ArticlePage } from './ArticlePage.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <UserProvider>
      <Dashboard></Dashboard>
      <Routes>
        <Route path="/" element={<Articles />}></Route>
        <Route path="/app" element={<App />}></Route>
        <Route path="/articles" element={<Articles />}></Route>
        <Route path="/article/:id" element={<ArticlePage />}></Route>
        <Route path="/add-course" element={<AddCourse />}></Route>
      </Routes>
      {/* <Footer></Footer> */}
      </UserProvider>
    </Router>
  </React.StrictMode>,
)
