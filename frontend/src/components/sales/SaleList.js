import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Row, Col, Alert, Badge } from 'react-bootstrap';
import { getSales } from '../../services/api';
import { Link } from 'react-router-dom';

const SaleList = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const response = await getSales();
      setSales(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar las ventas: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <Container>
      <Row className="my-3">
        <Col>
          <h2>Lista de Ventas</h2>
        </Col>
        <Col className="text-end">
          <Link to="/sales/new">
            <Button variant="primary">Nueva Venta</Button>
          </Link>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Items</th>
            <th>Subtotal</th>
            <th>IVA</th>
            <th>Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sales.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center">No hay ventas registradas</td>
            </tr>
          ) : (
            sales.map((sale) => (
              <tr key={sale._id}>
                <td>{formatDate(sale.createdAt)}</td>
                <td>{sale.client.fullName}</td>
                <td>
                  <Badge bg="info">{sale.items.length} productos</Badge>
                </td>
                <td>${sale.subtotal.toFixed(2)}</td>
                <td>${sale.tax.toFixed(2)}</td>
                <td>${sale.total.toFixed(2)}</td>
                <td>
                  <Link to={`/sales/${sale._id}`}>
                    <Button variant="info" size="sm" className="me-2">Ver Detalles</Button>
                  </Link>
                  <a 
                    //href={`http://localhost:5000/api/sales/${sale._id}/invoice`} 
                    //target="_blank" 
                    //rel="noopener noreferrer"
                  >
                    <Button   variant="secondary"
  size="sm"
  onClick={() => {
    const baseUrl = process.env.REACT_APP_BASE_URL;
    window.open(`${baseUrl}/api/sales/${sale._id}/invoice`, '_blank');
  }}>Factura</Button>
                  </a>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default SaleList;