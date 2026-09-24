import { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
        navigate('/');
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Error al registrarse.");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("No hay conexión con el servidor.");
    }
  };

  return (
    <Container fluid className="vh-100 p-0">
      <Row className="g-0 h-100">
        <Col md={5} lg={4} className="d-none d-md-flex flex-column justify-content-center p-5 text-white" style={{ backgroundColor: '#111c2d' }}>
          <div className="mb-5 text-center">
            <h1 className="display-3 mb-3">🏛️</h1>
            <h3 className="fw-bold">Crea tu cuenta</h3>
            <p className="text-light" style={{ opacity: 0.8 }}>Empieza a simular tus créditos hoy mismo</p>
          </div>
        </Col>

        <Col md={7} lg={8} className="d-flex align-items-center justify-content-center bg-white">
          <div style={{ width: '100%', maxWidth: '400px' }} className="p-4">
            <h3 className="fw-bold mb-2">Registro</h3>
            <p className="text-muted mb-4 small">Completa los datos para darte de alta</p>

            <Form onSubmit={handleRegister}>
              <Form.Group className="mb-3">
                <Form.Label className="small">Correo Electrónico</Form.Label>
                <Form.Control 
                  type="email" 
                  placeholder="tucorreo@email.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="small">Contraseña</Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder="Contraseña segura" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100 py-2 mb-3" style={{ backgroundColor: '#0d6efd' }}>
                Registrarse
              </Button>

              <div className="text-center">
                <Link to="/" className="text-decoration-none small text-muted">¿Ya tienes cuenta? Inicia sesión</Link>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}