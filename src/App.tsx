import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import HomePage from './pages/HomePage';
import CityDetailPage from './pages/CityDetailPage';
import Header from './components/Header/Header';
import './styles/globals.scss';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="app-container">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/city/:cityId" element={<CityDetailPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
