import { Container, Row, Col, Card, Button, Navbar, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const navigate = useNavigate();

  // Función para cerrar sesión (limpia el token y regresa al Login)
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      
      {/* Barra de Navegación Superior */}
      <Navbar bg="white" variant="light" expand="lg" className="shadow-sm px-4 mb-4">
        <Navbar.Brand href="#" className="fw-bold text-primary">
          🏛️ Simulador de Créditos
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav className="align-items-center">
            <span className="me-3 text-muted small">👤 <strong>Sebastian</strong> (Usuario)</span>
            <Button variant="outline-danger" size="sm" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {/* Contenido Principal del Dashboard */}
      <Container>
        
        {/* Sección de Bienvenida */}
        <Row className="mb-4">
          <Col>
            <h2 className="fw-bold text-dark">¡Bienvenido, Sebastian!</h2>
            <p className="text-muted">Simula tu crédito y toma la mejor decisión financiera.</p>
          </Col>
        </Row>

        {/* Tarjetas de Resumen (Widgets Estadísticos) */}
        <Row className="mb-5 g-4">
          <Col md={3}>
            <Card className="border-0 shadow-sm rounded-3 p-3">
              <div className="text-primary mb-2 fs-4">📊</div>
              <h6 className="text-muted small fw-bold">SIMULACIONES REALIZADAS</h6>
              <h3 className="fw-bold mb-0">5</h3>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm rounded-3 p-3">
              <div className="text-success mb-2 fs-4">💰</div>
              <h6 className="text-muted small fw-bold">MONTO TOTAL SIMULADO</h6>
              <h3 className="fw-bold mb-0">$48,000</h3>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm rounded-3 p-3">
              <div className="text-warning mb-2 fs-4">🕒</div>
              <h6 className="text-muted small fw-bold">ÚLTIMA SIMULACIÓN</h6>
              <h5 className="fw-bold mb-0 mt-1">12 abr, 2025</h5>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm rounded-3 p-3">
              <div className="text-info mb-2 fs-4">🏠</div>
              <h6 className="text-muted small fw-bold">CRÉDITO MÁS USADO</h6>
              <h5 className="fw-bold mb-0 mt-1">Vivienda</h5>
            </Card>
          </Col>
        </Row>

        {/* Tipos de Crédito Disponibles */}
        <Row className="mb-4">
          <Col>
            <h4 className="fw-bold mb-3">Tipos de crédito disponibles</h4>
          </Col>
        </Row>

        <Row className="g-4 mb-5">
          {/* Tarjeta Vivienda */}
          <Col md={3}>
            <Card className="border-0 shadow-sm rounded-3 h-100 text-center p-3">
              <Card.Body className="d-flex flex-column justify-content-between">
                <div>
                  <div className="fs-1 mb-3">🏠</div>
                  <h5 className="fw-bold">Vivienda</h5>
                  <p className="text-muted small mb-3">Desde 4.5% anual<br />Hasta 20 años</p>
                </div>
                <Button variant="primary" className="w-100 py-2" onClick={() => navigate('/simulador')}>
                  Simular
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Tarjeta Vehículo */}
          <Col md={3}>
            <Card className="border-0 shadow-sm rounded-3 h-100 text-center p-3">
              <Card.Body className="d-flex flex-column justify-content-between">
                <div>
                  <div className="fs-1 mb-3">🚗</div>
                  <h5 className="fw-bold">Vehículo</h5>
                  <p className="text-muted small mb-3">Desde 8.0% anual<br />Hasta 7 años</p>
                </div>
                <Button variant="primary" className="w-100 py-2" onClick={() => navigate('/simulador')}>
                  Simular
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Tarjeta Consumo */}
          <Col md={3}>
            <Card className="border-0 shadow-sm rounded-3 h-100 text-center p-3">
              <Card.Body className="d-flex flex-column justify-content-between">
                <div>
                  <div className="fs-1 mb-3">💳</div>
                  <h5 className="fw-bold">Consumo</h5>
                  <p className="text-muted small mb-3">Desde 12.0% anual<br />Hasta 5 años</p>
                </div>
                <Button variant="primary" className="w-100 py-2" onClick={() => navigate('/simulador')}>
                  Simular
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Tarjeta Educativo */}
          <Col md={3}>
            <Card className="border-0 shadow-sm rounded-3 h-100 text-center p-3">
              <Card.Body className="d-flex flex-column justify-content-between">
                <div>
                  <div className="fs-1 mb-3">🎓</div>
                  <h5 className="fw-bold">Educativo</h5>
                  <p className="text-muted small mb-3">Desde 7.0% anual<br />Hasta 10 años</p>
                </div>
                <Button variant="primary" className="w-100 py-2" onClick={() => navigate('/simulador')}>
                  Simular
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

      </Container>
    </div>
  );
}