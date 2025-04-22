import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { getClientById, createClient, updateClient } from '../../services/api';

const ClientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    documentType: 'CC',
    documentNumber: '',
    fullName: '',
    contactNumber: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      const fetchClient = async () => {
        try {
          setLoading(true);
          const response = await getClientById(id);
          setFormData(response.data);
        } catch (err) {
          setError('Error al cargar los datos del cliente: ' + err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchClient();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (isEditMode) {
        await updateClient(id, formData);
      } else {
        await createClient(formData);
      }
      navigate('/clients');
    } catch (err) {
      setError('Error al guardar el cliente: ' + err.message);
      setLoading(false);
    }
  };

  if (loading && isEditMode) return <p>Cargando...</p>;

  return (
    <Container>
      <Row className="justify-content-md-center my-4">
        <Col md={8}>
          <h2>{isEditMode ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Tipo de Documento</Form.Label>
              <Form.Select
                name="documentType"
                value={formData.documentType}
                onChange={handleChange}
                required
              >
                <option value="CC">Cédula de Ciudadanía</option>
                <option value="CE">Cédula de Extranjería</option>
                <option value="NIT">NIT</option>
                <option value="PP">Pasaporte</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Número de Documento</Form.Label>
              <Form.Control
                type="text"
                name="documentNumber"
                value={formData.documentNumber}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nombre Completo</Form.Label>
              <Form.Control
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar'}
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate('/clients')}
              className="ms-2"
            >
              Cancelar
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ClientForm;