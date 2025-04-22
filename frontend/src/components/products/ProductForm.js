import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Alert, Image } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, createProduct, updateProduct } from '../../services/api';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    productId: '',
    name: '',
    description: '',
    quantity: 0,
    unitPrice: 0
  });
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          const response = await getProductById(id);
          setFormData({
            productId: response.data.productId,
            name: response.data.name,
            description: response.data.description,
            quantity: response.data.quantity,
            unitPrice: response.data.unitPrice
          });
          setPreviewImage(`http://localhost:5000${response.data.image}`);
        } catch (err) {
          setError('Error al cargar los datos del producto: ' + err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ 
      ...formData, 
      [name]: name === 'quantity' || name === 'unitPrice' ? parseFloat(value) : value 
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const formDataToSend = new FormData();
      formDataToSend.append('productId', formData.productId);
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('quantity', formData.quantity);
      formDataToSend.append('unitPrice', formData.unitPrice);
      
      if (image) {
        formDataToSend.append('image', image);
      }
      
      if (isEditMode) {
        await updateProduct(id, formDataToSend);
      } else {
        await createProduct(formDataToSend);
      }
      
      navigate('/products');
    } catch (err) {
      setError('Error al guardar el producto: ' + err.message);
      setLoading(false);
    }
  };

  if (loading && isEditMode) return <p>Cargando...</p>;

  return (
    <Container>
      <Row className="justify-content-md-center my-4">
        <Col md={8}>
          <h2>{isEditMode ? 'Editar Producto' : 'Nuevo Producto'}</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>ID del Producto</Form.Label>
              <Form.Control
                type="text"
                name="productId"
                value={formData.productId}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Cantidad</Form.Label>
              <Form.Control
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="0"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Precio Unitario</Form.Label>
              <Form.Control
                type="number"
                name="unitPrice"
                value={formData.unitPrice}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Imagen</Form.Label>
              <Form.Control
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                required={!isEditMode}
              />
              {previewImage && (
                <div className="mt-2">
                  <Image 
                    src={previewImage} 
                    alt="Vista previa" 
                    thumbnail 
                    style={{ width: '100px', height: '100px' }}
                  />
                </div>
              )}
            </Form.Group>

            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar'}
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate('/products')}
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

export default ProductForm;