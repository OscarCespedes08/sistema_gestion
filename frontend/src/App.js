import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// Componentes
import Header from './components/Header';
import Footer from './components/Footer';

// Pantallas
import HomeScreen from './screens/HomeScreen';
import ClientList from './components/clients/ClientList';
import ClientForm from './components/clients/ClientForm';
import ProductList from './components/products/ProductList';
import ProductForm from './components/products/ProductForm';
import SaleList from './components/sales/SaleList';
import SaleForm from './components/sales/SaleForm';

function App() {
  return (
    <>
      <Header />
      <main className="py-3">
        <Container>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/clients" element={<ClientList />} />
            <Route path="/clients/new" element={<ClientForm />} />
            <Route path="/clients/edit/:id" element={<ClientForm />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/new" element={<ProductForm />} />
            <Route path="/products/edit/:id" element={<ProductForm />} />
            <Route path="/sales" element={<SaleList />} />
            <Route path="/sales/new" element={<SaleForm />} />
            <Route path="/sales/:id" element={<SaleForm />} />
          </Routes>
        </Container>
      </main>
      <Footer />
    </>
  );
}



<Routes>
  <Route path="/" element={<HomeScreen />} />
  <Route path="/clients" element={<ClientList />} />
  <Route path="/clients/new" element={<ClientForm />} />
  <Route path="/clients/edit/:id" element={<ClientForm />} />
  <Route path="/products" element={<ProductList />} />
  <Route path="/products/new" element={<ProductForm />} />
  <Route path="/products/edit/:id" element={<ProductForm />} />
  <Route path="/sales" element={<SaleList />} />
  <Route path="/sales/new" element={<SaleForm />} />
  <Route path="/sales/:id" element={<SaleForm />} />
</Routes>

export default App;
