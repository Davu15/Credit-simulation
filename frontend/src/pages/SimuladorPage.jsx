import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Navbar, Nav, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const limitesCredito = {
  'Vivienda': { minMonto: 10000, maxMonto: 150000, minPlazo: 5, maxPlazo: 25 },
  'Vehículo': { minMonto: 3000, maxMonto: 50000, minPlazo: 1, maxPlazo: 5 },
  'Consumo': { minMonto: 500, maxMonto: 20000, minPlazo: 1, maxPlazo: 4 },
  'Educativo': { minMonto: 1000, maxMonto: 30000, minPlazo: 1, maxPlazo: 7 }
};

export default function SimuladorPage() {
  const navigate = useNavigate();

  const [tipoCredito, setTipoCredito] = useState('Vivienda');
  const [monto, setMonto] = useState(100000);
  const [plazo, setPlazo] = useState(20);
  const [sistema, setSistema] = useState('Frances');
  const [seguroDesgravamen, setSeguroDesgravamen] = useState(true);
  const [seguroIncendio, setSeguroIncendio] = useState(true);
  const [resultado, setResultado] = useState(null);

  const limitesActuales = limitesCredito[tipoCredito];

  useEffect(() => {
    if (monto < limitesActuales.minMonto) setMonto(limitesActuales.minMonto);
    if (monto > limitesActuales.maxMonto) setMonto(limitesActuales.maxMonto);
    if (plazo < limitesActuales.minPlazo) setPlazo(limitesActuales.minPlazo);
    if (plazo > limitesActuales.maxPlazo) setPlazo(limitesActuales.maxPlazo);
    setResultado(null);
  }, [tipoCredito]);

  const handleSimular = async (e) => {
    e.preventDefault();
    
    if (monto < limitesActuales.minMonto || monto > limitesActuales.maxMonto) {
      alert(`El monto debe estar entre $${limitesActuales.minMonto} y $${limitesActuales.maxMonto}`);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert("No estás autenticado. Por favor, inicia sesión nuevamente.");
      navigate('/');
      return;
    }

    const requestData = {
      tipoCredito,
      monto: Number(monto),
      plazo: Number(plazo),
      sistemaAmortizacion: sistema,
      seguroDesgravamen,
      seguroIncendio
    };

    try {
      const response = await fetch('http://localhost:5000/api/credit/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
      });

      if (response.ok) {
        const data = await response.json();
        setResultado(data);
      } else if (response.status === 401) {
        alert("Tu sesión ha expirado. Vuelve a iniciar sesión.");
        localStorage.removeItem('token');
        navigate('/');
      } else {
        alert("Error al calcular la simulación en el servidor.");
      }
    } catch (error) {
      console.error("Error de red:", error);
      alert("No se pudo conectar con el servidor.");
    }
  };

  // --- CÁLCULOS ENRIQUECIDOS (Igual a la imagen de referencia) ---
  let totalInteres = 0;
  let totalCapital = 0;
  let totalSeguroDesg = 0;
  let totalSeguroInc = 0;
  let tablaEnriquecida = [];

  if (resultado && resultado.tabla) {
    tablaEnriquecida = resultado.tabla.map((row) => {
      // Calculamos seguros basándonos en tu imagen
      // Desgravamen sobre saldo inicial del mes (~0.057%)
      const saldoInicial = row.saldo + row.capital;
      const sDesg = seguroDesgravamen ? saldoInicial * 0.000574 : 0;
      // Incendio es un monto fijo según el capital prestado (~0.026%)
      const sInc = seguroIncendio ? monto * 0.00026 : 0; 
      
      const valorCuotaTotal = row.capital + row.interes + sDesg + sInc;

      totalInteres += row.interes;
      totalCapital += row.capital;
      totalSeguroDesg += sDesg;
      totalSeguroInc += sInc;

      return {
        ...row,
        seguroDesg: sDesg,
        seguroIncendio: sInc,
        valorCuotaTotal
      };
    });
  }

  const totalAPagar = totalCapital + totalInteres + totalSeguroDesg + totalSeguroInc;
  const primeraCuota = tablaEnriquecida.length > 0 ? tablaEnriquecida[0].valorCuotaTotal : 0;

  const generarPDF = () => {
    if (!resultado) return;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(0, 86, 179);
    doc.text("Reporte de Simulación de Crédito", 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(40, 40, 40);
    doc.text(`Producto: ${tipoCredito.toUpperCase()}`, 14, 35);
    doc.text(`Plazo (meses): ${resultado.plazo * 12}`, 14, 41);
    doc.text(`Capital: $${resultado.monto.toLocaleString()}`, 120, 35);
    doc.text(`Total de interés: $${totalInteres.toLocaleString(undefined, {minimumFractionDigits: 2})}`, 120, 41);
    doc.text(`Total seguros: $${(totalSeguroDesg + totalSeguroInc).toLocaleString(undefined, {minimumFractionDigits: 2})}`, 120, 47);

    // Ajustamos las columnas del PDF a las solicitadas
    const tableColumn = ["Cuotas", "Fecha de pago", "Capital", "Interés", "Seguros desg.", "Seguro Incendios", "Valor cuota", "Saldo"];
    const tableRows = tablaEnriquecida.map(row => [
      row.cuota,
      row.fecha,
      `$${row.capital.toFixed(2)}`,
      `$${row.interes.toFixed(2)}`,
      `$${row.seguroDesg.toFixed(2)}`,
      `$${row.seguroIncendio.toFixed(2)}`,
      `$${row.valorCuotaTotal.toFixed(2)}`,
      `$${row.saldo.toFixed(2)}`
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 55,
      theme: 'striped',
      headStyles: { fillColor: [0, 86, 179] },
      styles: { fontSize: 8, halign: 'center' }
    });

    doc.save(`Tabla_Amortizacion_${tipoCredito}.pdf`);
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
        <div className="text-center mb-5">
          <h2 className="fw-bold text-primary">¿Qué crédito necesitas?</h2>
          <p className="text-muted">Ingresa los siguientes datos para empezar la simulación</p>
        </div>

        <Row className="g-4 mb-5">
          <Col lg={6}>
            <Card className="border-0 shadow-sm rounded-4 p-4 h-100">
              <Form onSubmit={handleSimular}>
                <Form.Group className="mb-4">
                  <Form.Label className="small fw-bold text-muted">Tipo de crédito</Form.Label>
                  <Form.Select value={tipoCredito} onChange={(e) => setTipoCredito(e.target.value)} className="shadow-none">
                    <option value="Vivienda">Hipotecario Vivienda</option>
                    <option value="Vehículo">Vehículo</option>
                    <option value="Consumo">Consumo</option>
                    <option value="Educativo">Educativo</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="small fw-bold text-muted">¿Cuánto dinero necesitas que te prestemos?</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text bg-white">$</span>
                    <Form.Control type="number" value={monto} min={limitesActuales.minMonto} max={limitesActuales.maxMonto} onChange={(e) => setMonto(e.target.value)} required className="shadow-none" />
                  </div>
                  <Form.Text className="text-muted" style={{fontSize: '0.75rem'}}>
                    Min. ${limitesActuales.minMonto.toLocaleString()} - Máx. ${limitesActuales.maxMonto.toLocaleString()}
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="small fw-bold text-muted">¿En cuánto tiempo quieres pagarlo? (años)</Form.Label>
                  <Form.Control type="number" value={plazo} min={limitesActuales.minPlazo} max={limitesActuales.maxPlazo} onChange={(e) => setPlazo(e.target.value)} required className="shadow-none" />
                  <Form.Text className="text-muted" style={{fontSize: '0.75rem'}}>
                    Min. {limitesActuales.minPlazo} años - Máx. {limitesActuales.maxPlazo} años
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="small fw-bold text-muted">Sistema de amortización</Form.Label>
                  <Form.Select value={sistema} onChange={(e) => setSistema(e.target.value)} className="shadow-none">
                    <option value="Frances">Francés (Cuotas fijas)</option>
                    <option value="Aleman">Alemán (Capital fijo)</option>
                  </Form.Select>
                </Form.Group>

                {/* AHORA SON DOS CHECKBOXES INDEPENDIENTES */}
                <Form.Group className="mb-4">
                  <Form.Check type="checkbox" label="Seguro de desgravamen" checked={seguroDesgravamen} onChange={(e) => setSeguroDesgravamen(e.target.checked)} className="mb-2" />
                  <Form.Check type="checkbox" label="Seguro de incendio / vehículo" checked={seguroIncendio} onChange={(e) => setSeguroIncendio(e.target.checked)} />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 py-3 fw-bold rounded-3">
                  Calcular simulación
                </Button>
              </Form>
            </Card>
          </Col>

          <Col lg={6}>
            <Card className="border-0 shadow-sm rounded-4 p-5 h-100 d-flex flex-column justify-content-center bg-white">
              {!resultado ? (
                <div className="text-center">
                  <h4 className="text-muted mb-3">Tus pagos mensuales serán</h4>
                  <h1 className="display-3 text-secondary fw-bold mb-3">$0</h1>
                  <p className="text-muted mb-5">Durante 0 meses</p>
                  <hr className="mb-4" />
                  <h5 className="fw-bold text-muted mb-3">Detalle de tu crédito</h5>
                  <p className="small text-muted">Realiza una simulación para ver el desglose.</p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-4">
                    <h5 className="text-secondary fw-semibold mb-4">Tus pagos mensuales iniciarán en</h5>
                    
                    <h1 className="text-primary fw-bold display-3 mb-2">
                      ${primeraCuota.toFixed(2)}
                    </h1>
                    <p className="text-muted fw-medium mb-1">Durante {resultado.plazo * 12} meses</p>
                    <p className="small text-muted">Sistema {sistema}</p>
                  </div>

                  <hr className="my-4" style={{borderStyle: 'dashed'}} />

                  <div className="px-3">
                    <h6 className="fw-bold text-secondary mb-4">Detalle de tu crédito</h6>
                    <div className="d-flex justify-content-between mb-3 text-muted">
                      <span>Capital prestado:</span> 
                      <span className="fw-medium">${totalCapital.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-3 text-muted">
                      <span>Total de interés:</span> 
                      <span className="fw-medium">${totalInteres.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-3 text-muted">
                      <span>Total seguro desgravamen:</span> 
                      <span className="fw-medium">${totalSeguroDesg.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-3 text-muted">
                      <span>Total seguro incendio/vehículo:</span> 
                      <span className="fw-medium">${totalSeguroInc.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between fw-bold fs-5 text-dark mt-3">
                      <span>Total estimado a pagar:</span> 
                      <span className="text-primary">${totalAPagar.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                    </div>
                  </div>
                </>
              )}
            </Card>
          </Col>
        </Row>

        {resultado && (
          <Row className="mt-4">
            <Col>
              <Card className="border-0 shadow-sm rounded-4 p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h4 className="fw-bold m-0" style={{ color: '#003366' }}>Tabla de amortización</h4>
                    <span className="text-muted small">
                      Tasa Referencial: 9.40% | Plazo: {resultado.plazo * 12} meses | Producto: {tipoCredito.toUpperCase()}
                    </span>
                  </div>
                  <Button variant="danger" className="fw-bold px-4" onClick={generarPDF}>
                    📄 Descargar PDF
                  </Button>
                </div>
                
                <div style={{ maxHeight: '450px', overflowY: 'auto' }}>
                  <Table bordered hover responsive className="text-center align-middle" style={{ borderColor: '#dee2e6' }}>
                    <thead style={{ backgroundColor: '#f8f9fa' }}>
                      <tr className="small text-muted fw-bold">
                        <th>Cuotas</th>
                        <th>Fecha de pago</th>
                        <th>Capital</th>
                        <th>Interés</th>
                        <th>Seguros desg.</th>
                        <th>Seguro Incendios/Vehiculo</th>
                        <th>Valor cuota</th>
                        <th>Saldo</th>
                      </tr>
                    </thead>
                    <tbody className="small">
                      {tablaEnriquecida.map((row) => (
                        <tr key={row.cuota}>
                          <td className="text-muted">{row.cuota}</td>
                          <td className="text-muted">{row.fecha}</td>
                          <td>${row.capital.toFixed(2)}</td>
                          <td>${row.interes.toFixed(2)}</td>
                          <td>${row.seguroDesg.toFixed(2)}</td>
                          <td>${row.seguroIncendio.toFixed(2)}</td>
                          <td className="fw-bold">${row.valorCuotaTotal.toFixed(2)}</td>
                          <td className="text-muted">${row.saldo.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
}