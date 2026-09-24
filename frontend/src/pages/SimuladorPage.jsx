import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Navbar, Nav, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function SimuladorPage() {
  const navigate = useNavigate();

  const [tipoCredito, setTipoCredito] = useState('Vivienda');
  const [monto, setMonto] = useState(100000);
  const [plazo, setPlazo] = useState(20);
  const [sistema, setSistema] = useState('Frances');
  const [seguroDesgravamen, setSeguroDesgravamen] = useState(true);
  const [seguroIncendio, setSeguroIncendio] = useState(true);
  const [resultado, setResultado] = useState(null);

  const handleSimular = (e) => {
    e.preventDefault();
    const cuotaMensual = 632.16;
    
    setResultado({
      monto: Number(monto),
      plazo: Number(plazo),
      cuotaMensual,
      tabla: [
        { cuota: 1, fecha: '12/10/2026', valor: cuotaMensual, interes: 375.00, capital: 257.16, saldo: 99742.84 },
        { cuota: 2, fecha: '12/11/2026', valor: cuotaMensual, interes: 374.44, capital: 258.72, saldo: 99484.12 },
        { cuota: 3, fecha: '12/12/2026', valor: cuotaMensual, interes: 373.07, capital: 259.09, saldo: 99225.03 },
        { cuota: 4, fecha: '12/01/2027', valor: cuotaMensual, interes: 372.09, capital: 260.07, saldo: 98964.96 },
        { cuota: 5, fecha: '12/02/2027', valor: cuotaMensual, interes: 371.71, capital: 260.45, saldo: 98704.51 },
      ]
    });
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <Navbar bg="white" variant="light" expand="lg" className="shadow-sm px-4 mb-4">
        <Navbar.Brand href="/dashboard" className="fw-bold text-primary" style={{ cursor: 'pointer' }}>
          🏛️ Simulador de Créditos
        </Navbar.Brand>
        <Navbar.Collapse className="justify-content-end">
          <Nav className="align-items-center">
            <Button variant="outline-secondary" size="sm" className="me-3" onClick={() => navigate('/dashboard')}>
              Volver al Inicio
            </Button>
            <span className="me-3 text-muted small">👤 <strong>Sebastian</strong></span>
            <Button variant="outline-danger" size="sm" onClick={() => { localStorage.removeItem('token'); navigate('/'); }}>
              Cerrar Sesión
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Container className="pb-5">
        <Row className="mb-4">
          <Col>
            <h2 className="fw-bold">Simulador de Créditos</h2>
            <p className="text-muted">Completa los datos y obtén una simulación de tu crédito en tiempo real.</p>
          </Col>
        </Row>

        <Row className="g-4">
          <Col lg={6}>
            <Card className="border-0 shadow-sm rounded-4 p-4">
              <h4 className="fw-bold mb-3">Datos del crédito</h4>
              <Form onSubmit={handleSimular}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold text-muted">Tipo de crédito</Form.Label>
                  <Form.Select value={tipoCredito} onChange={(e) => setTipoCredito(e.target.value)}>
                    <option value="Vivienda">Vivienda</option>
                    <option value="Vehículo">Vehículo</option>
                    <option value="Consumo">Consumo</option>
                    <option value="Educativo">Educativo</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold text-muted">Monto del crédito ($)</Form.Label>
                  <Form.Control type="number" value={monto} onChange={(e) => setMonto(e.target.value)} required />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold text-muted">Plazo (años)</Form.Label>
                  <Form.Control type="number" value={plazo} onChange={(e) => setPlazo(e.target.value)} required />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold text-muted">Sistema de amortización</Form.Label>
                  <Form.Select value={sistema} onChange={(e) => setSistema(e.target.value)}>
                    <option value="Frances">Francés (Cuotas fijas)</option>
                    <option value="Aleman">Alemán (Capital fijo)</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Check type="checkbox" label="Seguro de desgravamen" checked={seguroDesgravamen} onChange={(e) => setSeguroDesgravamen(e.target.checked)} />
                  <Form.Check type="checkbox" label="Seguro de incendio" checked={seguroIncendio} onChange={(e) => setSeguroIncendio(e.target.checked)} />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 py-2 fw-semibold">
                  🧮 Calcular simulación
                </Button>
              </Form>
            </Card>
          </Col>

          <Col lg={6}>
            {!resultado ? (
              <Card className="border-0 shadow-sm rounded-4 p-4 h-100 d-flex align-items-center justify-content-center text-center bg-light">
                <div>
                  <h3 className="text-secondary mb-2">💡 Información</h3>
                  <p className="text-muted small px-4">
                    Selecciona tus parámetros y calcula tu cuota mensual para visualizar la tabla de amortización detallada.
                  </p>
                </div>
              </Card>
            ) : (
              <Card className="border-0 shadow-sm rounded-4 p-4">
                <h4 className="fw-bold mb-3">Resultados de la Simulación</h4>
                <div className="bg-light p-3 rounded-3 mb-4">
                  <Row className="text-center">
                    <Col>
                      <span className="text-muted small d-block">Monto</span>
                      <strong>${Number(resultado.monto).toLocaleString()}</strong>
                    </Col>
                    <Col>
                      <span className="text-muted small d-block">Plazo</span>
                      <strong>{resultado.plazo} años</strong>
                    </Col>
                    <Col>
                      <span className="text-muted small d-block">Cuota Mensual</span>
                      <strong className="text-primary fs-5">${resultado.cuotaMensual}</strong>
                    </Col>
                  </Row>
                </div>

                <h5 className="fw-bold mb-3">Tabla de Amortización</h5>
                <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                  <Table striped bordered hover size="sm" className="text-center small">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Fecha</th>
                        <th>Cuota</th>
                        <th>Interés</th>
                        <th>Capital</th>
                        <th>Saldo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resultado.tabla.map((row) => (
                        <tr key={row.cuota}>
                          <td>{row.cuota}</td>
                          <td>{row.fecha}</td>
                          <td>${row.valor.toFixed(2)}</td>
                          <td>${row.interes.toFixed(2)}</td>
                          <td>${row.capital.toFixed(2)}</td>
                          <td>${row.saldo.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}