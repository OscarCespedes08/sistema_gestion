import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const HomeScreen = () => {
  return (
    <Container>
      <h1 className="my-4 text-center">Sistema de Gestión</h1>
      <Row>
        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Clientes</Card.Title>
              <Card.Text>
                Gestione la información de sus clientes. Agregue, edite y elimine registros.
              </Card.Text>
              <Link to="/clients" className="btn btn-primary">
                Ir a Clientes
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Productos</Card.Title>
              <Card.Text>
                Administre su inventario de productos. Controle stock, precios y más.
              </Card.Text>
              <Link to="/products" className="btn btn-primary">
                Ir a Productos
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Ventas</Card.Title>
              <Card.Text>
                Registre ventas y genere facturas para sus clientes.
              </Card.Text>
              <Link to="/sales" className="btn btn-primary">
                Ir a Ventas
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HomeScreen;