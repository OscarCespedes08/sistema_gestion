import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Row, Col, Alert, Image } from 'react-bootstrap';
import { getProducts, deleteProduct } from '../../services/api';
import { Link } from 'react-router-dom';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts();
      setProducts(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los productos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await deleteProduct(id);
        setProducts(products.filter(product => product._id !== id));
        alert('Producto eliminado con éxito');
      } catch (err) {
        setError('Error al eliminar el producto: ' + err.message);
      }
    }
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <Container>
      <Row className="my-3">
        <Col>
          <h2>Lista de Productos</h2>
        </Col>
        <Col className="text-end">
          <Link to="/products/new">
            <Button variant="primary">Nuevo Producto</Button>
          </Link>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Imagen</th>
            <th>ID Producto</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center">No hay productos registrados</td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product._id}>
                <td>
                  <Image 
                    src={`http://localhost:5000${product.image}`} 
                    alt={product.name} 
                    thumbnail 
                    style={{ width: '50px', height: '50px' }}
                  />
                </td>
                <td>{product.productId}</td>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.quantity}</td>
                <td>${product.unitPrice.toFixed(2)}</td>
                <td>
                  <Link to={`/products/edit/${product._id}`}>
                    <Button variant="info" size="sm" className="me-2">Editar</Button>
                  </Link>
                  <Button 
                    variant="danger" 
                    size="sm" 
                    onClick={() => handleDelete(product._id)}
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

export default ProductList;