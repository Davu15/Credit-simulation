import { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Llamada al ApiGateway
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        // 1. Extraemos el cuerpo de la respuesta (donde viene el token)
        const data = await response.json(); 
        
        // 2. Lo mostramos en la consola para que puedas verlo
        console.log("¡Token recibido del backend! Aquí está:", data); 
        
        // 3. Lo guardamos en el almacenamiento del navegador para usarlo después
        localStorage.setItem('token', data.token); 

        // 4. Viajamos al Dashboard
        navigate('/dashboard'); 
      } else { 
        alert("Credenciales incorrectas. Verifica tu usuario y contraseña.");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("No hay conexión con el servidor. Verifica que el ApiGateway esté corriendo.");
    }
  };

  return (
    <Container fluid className="vh-100 p-0">
      <Row className="g-0 h-100">
        
        {/* Panel Izquierdo */}
        <Col md={5} lg={4} className="d-none d-md-flex flex-column justify-content-center p-5 text-white" style={{ backgroundColor: '#111c2d' }}>
          <div className="mb-5 text-center">
            <h1 className="display-3 mb-3">🏛️</h1>
            <h3 className="fw-bold">Simulador de Créditos</h3>
            <p className="text-light" style={{ opacity: 0.8 }}>Planifica tu futuro, simula tu crédito</p>
          </div>

          <div className="mt-4 px-3">
            <div className="d-flex align-items-center mb-4">
              <span className="me-3 fs-5">🧮</span>
              <span className="fw-light">Calcula tu cuota mensual</span>
            </div>
            <div className="d-flex align-items-center mb-4">
              <span className="me-3 fs-5">⚖️</span>
              <span className="fw-light">Compara diferentes tipos de crédito</span>
            </div>
            <div className="d-flex align-items-center mb-4">
              <span className="me-3 fs-5">📄</span>
              <span className="fw-light">Descarga tu tabla de amortización en PDF</span>
            </div>
          </div>
        </Col>

        {/* Panel Derecho */}
        <Col md={7} lg={8} className="d-flex align-items-center justify-content-center bg-white">
          <div style={{ width: '100%', maxWidth: '400px' }} className="p-4">
            <h3 className="fw-bold mb-2">Iniciar Sesión</h3>
            <p className="text-muted mb-4 small">Ingresa tus credenciales para continuar</p>

            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3">
                <Form.Label className="small">Usuario</Form.Label>
                <div className="input-group">
                  <span className="input-group-text bg-transparent text-muted">👤</span>
                  <Form.Control 
                    type="text" 
                    placeholder="Ingresa tu usuario" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="small">Contraseña</Form.Label>
                <div className="input-group">
                  <span className="input-group-text bg-transparent text-muted">🔒</span>
                  <Form.Control 
                    type="password" 
                    placeholder="Ingresa tu contraseña" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Check 
                  type="checkbox" 
                  label="Recordar sesión" 
                  className="text-muted small"
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100 py-2 mb-4" style={{ backgroundColor: '#0d6efd' }}>
                Ingresar
              </Button>

              <div className="text-center">
                <a href="#" className="text-decoration-none small" style={{ color: '#0d6efd' }}>¿No tienes una cuenta? Regístrate</a>
              </div>
            </Form>
          </div>
        </Col>
        
      </Row>
    </Container>
  );
}