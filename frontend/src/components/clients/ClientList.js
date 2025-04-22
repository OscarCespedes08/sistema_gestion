import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { getClients, deleteClient } from '../../services/api';
import { Link } from 'react-router-dom';

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await getClients();
      setClients(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los clientes: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este cliente?')) {
      try {
        await deleteClient(id);
        setClients(clients.filter(client => client._id !== id));
        alert('Cliente eliminado con éxito');
      } catch (err) {
        setError('Error al eliminar el cliente: ' + err.message);
      }
    }
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <Container>
      <Row className="my-3">
        <Col>
          <h2>Lista de Clientes</h2>
        </Col>
        <Col className="text-end">
          <Link to="/clients/new">
            <Button variant="primary">Nuevo Cliente</Button>
          </Link>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Tipo Documento</th>
            <th>Número Documento</th>
            <th>Nombre Completo</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clients.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">No hay clientes registrados</td>
            </tr>
          ) : (
            clients.map((client) => (
              <tr key={client._id}>
                <td>{client.documentType}</td>
                <td>{client.documentNumber}</td>
                <td>{client.fullName}</td>
                <td>{client.contactNumber}</td>
                <td>{client.email}</td>
                <td>
                  <Link to={`/clients/edit/${client._id}`}>
                    <Button variant="info" size="sm" className="me-2">Editar</Button>
                  </Link>
                  <Button 
                    variant="danger" 
                    size="sm" 
                    onClick={() => handleDelete(client._id)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default ClientList;