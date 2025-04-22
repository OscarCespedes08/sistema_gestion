import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Alert, Table, Card } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { getClients, getProducts, getSaleById, createSale } from '../../services/api';

const SaleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isViewMode = Boolean(id);

  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [sale, setSale] = useState(null);
  
  const [formData, setFormData] = useState({
    clientId: '',
    items: []
  });
  
  const [currentItem, setCurrentItem] = useState({
    productId: '',
    quantity: 1
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar clientes y productos
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [clientsResponse, productsResponse] = await Promise.all([
          getClients(),
          getProducts()
        ]);
        setClients(clientsResponse.data);
        setProducts(productsResponse.data);
        
        if (isViewMode) {
          const saleResponse = await getSaleById(id);
          setSale(saleResponse.data);
        }
        
        setError(null);
      } catch (err) {
        setError('Error al cargar los datos: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, isViewMode]);

  const handleClientChange = (e) => {
    setFormData({ ...formData, clientId: e.target.value });
  };

  const handleProductChange = (e) => {
    setCurrentItem({ ...currentItem, productId: e.target.value });
  };

  const handleQuantityChange = (e) => {
    setCurrentItem({ ...currentItem, quantity: parseInt(e.target.value) });
  };

  const addItemToSale = () => {
    if (!currentItem.productId || currentItem.quantity <= 0) {
      setError('Por favor seleccione un producto y una cantidad válida');
      return;
    }
    
    const product = products.find(p => p._id === currentItem.productId);
    if (!product) {
      setError('Producto no encontrado');
      return;
    }
    
    if (product.quantity < currentItem.quantity) {
      setError(`Stock insuficiente. Solo hay ${product.quantity} unidades disponibles.`);
      return;
    }
    
    // Verificar si el producto ya está en la lista
    const existingItemIndex = formData.items.findIndex(
      item => item.productId === currentItem.productId
    );
    
    if (existingItemIndex >= 0) {
      // Actualizar cantidad si ya existe
      const updatedItems = [...formData.items];
      updatedItems[existingItemIndex].quantity += currentItem.quantity;
      
      // Verificar stock nuevamente
      if (product.quantity < updatedItems[existingItemIndex].quantity) {
        setError(`Stock insuficiente. Solo hay ${product.quantity} unidades disponibles.`);
        return;
      }
      
      setFormData({ ...formData, items: updatedItems });
    } else {
      // Agregar nuevo item
      setFormData({
        ...formData,
        items: [...formData.items, { ...currentItem }]
      });
    }
    
    // Resetear el item actual
    setCurrentItem({
      productId: '',
      quantity: 1
    });
    
    setError(null);
  };

  const removeItem = (index) => {
    const updatedItems = [...formData.items];
    updatedItems.splice(index, 1);
    setFormData({ ...formData, items: updatedItems });
  };

  const calculateTotal = () => {
    let subtotal = 0;
    
    formData.items.forEach(item => {
      const product = products.find(p => p._id === item.productId);
      if (product) {
        subtotal += product.unitPrice * item.quantity;
      }
    });
    
    const tax = subtotal * 0.19;
    const total = subtotal + tax;
    
    return { subtotal, tax, total };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.clientId) {
      setError('Por favor seleccione un cliente');
      return;
    }
    
    if (formData.items.length === 0) {
      setError('Por favor agregue al menos un producto');
      return;
    }
    
    try {
      setLoading(true);
      await createSale(formData);
      navigate('/sales');
    } catch (err) {
      setError('Error al crear la venta: ' + err.message);
      setLoading(false);
    }
  };

  if (loading && !products.length) return <p>Cargando...</p>;

  // Modo visualización
  if (isViewMode && sale) {
    return (
      <Container>
        <h2 className="my-4">Detalles de Venta</h2>
        
        <Card className="mb-4">
          <Card.Header>Información General</Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <p><strong>Cliente:</strong> {sale.client.fullName}</p>
                <p><strong>Documento:</strong> {sale.client.documentNumber}</p>
                <p><strong>Contacto:</strong> {sale.client.contactNumber}</p>
              </Col>
              <Col md={6}>
                <p><strong>Fecha:</strong> {new Date(sale.createdAt).toLocaleDateString()}</p>
                <p><strong>Hora:</strong> {new Date(sale.createdAt).toLocaleTimeString()}</p>
                <p><strong>Email:</strong> {sale.client.email}</p>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        
        <h4>Productos</h4>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {sale.items.map((item, index) => (
              <tr key={index}>
                <td>{item.product.name}</td>
                <td>{item.quantity}</td>
                <td>${item.unitPrice.toFixed(2)}</td>
                <td>${item.totalPrice.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        
        <Card className="mt-4">
          <Card.Body>
            <Row className="text-end">
              <Col>
                <p><strong>Subtotal:</strong> ${sale.subtotal.toFixed(2)}</p>
                <p><strong>IVA (19%):</strong> ${sale.tax.toFixed(2)}</p>
                <h4><strong>Total:</strong> ${sale.total.toFixed(2)}</h4>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        
        <div className="d-flex justify-content-between mt-4">
          <Button variant="secondary" onClick={() => navigate('/sales')}>
            Volver
          </Button>
          <a 
            href={`${window.location.origin}/api/sales/${sale._id}/invoice`} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button variant="primary">Descargar Factura</Button>
          </a>
        </div>
      </Container>
    );
  }

  // Modo creación
  return (
    <Container>
      <h2 className="my-4">Nueva Venta</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Cliente</Form.Label>
              <Form.Select
                value={formData.clientId}
                onChange={handleClientChange}
                required
              >
                <option value="">Seleccione un cliente</option>
                {clients.map(client => (
                  <option key={client._id} value={client._id}>
                    {client.fullName} - {client.documentNumber}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        
        <Card className="mb-4">
          <Card.Header>Agregar Productos</Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Producto</Form.Label>
                  <Form.Select
                    value={currentItem.productId}
                    onChange={handleProductChange}
                  >
                    <option value="">Seleccione un producto</option>
                    {products.map(product => (
                      <option key={product._id} value={product._id} disabled={product.quantity <= 0}>
                        {product.name} - ${product.unitPrice.toFixed(2)} - Stock: {product.quantity}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Cantidad</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    value={currentItem.quantity}
                    onChange={handleQuantityChange}
                  />
                </Form.Group>
              </Col>
              <Col md={3} className="d-flex align-items-end">
                <Button 
                  variant="primary" 
                  onClick={addItemToSale}
                  className="mb-3 w-100"
                >
                  Agregar
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        
        {formData.items.length > 0 && (
          <>
            <h4>Productos Agregados</h4>
            <Table striped bordered hover className="mb-4">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario</th>
                  <th>Total</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {formData.items.map((item, index) => {
                  const product = products.find(p => p._id === item.productId);
                  return (
                    <tr key={index}>
                      <td>{product ? product.name : 'Producto no encontrado'}</td>
                      <td>{item.quantity}</td>
                      <td>${product ? product.unitPrice.toFixed(2) : '0.00'}</td>
                      <td>${product ? (product.unitPrice * item.quantity).toFixed(2) : '0.00'}</td>
                      <td>
                        <Button 
                          variant="danger" 
                          size="sm"
                          onClick={() => removeItem(index)}
                        >
                          Eliminar
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            
            {formData.items.length > 0 && (
              <Card className="mb-4">
                <Card.Body>
                  <Row className="text-end">
                    <Col>
                      {(() => {
                        const { subtotal, tax, total } = calculateTotal();
                        return (
                          <>
                            <p><strong>Subtotal:</strong> ${subtotal.toFixed(2)}</p>
                            <p><strong>IVA (19%):</strong> ${tax.toFixed(2)}</p>
                            <h4><strong>Total:</strong> ${total.toFixed(2)}</h4>
                          </>
                        );
                      })()}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            )}
          </>
        )}
        
        <div className="d-flex justify-content-between mt-4">
          <Button variant="secondary" onClick={() => navigate('/sales')}>
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            type="submit"
            disabled={formData.items.length === 0 || !formData.clientId}
          >
            Crear Venta
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default SaleForm;