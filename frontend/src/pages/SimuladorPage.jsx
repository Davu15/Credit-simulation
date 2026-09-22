import { useState } from 'react';
import { TablaAmortizacion } from './TablaAmortizacion';

export const SimuladorCredito = () => {
  const [monto, setMonto] = useState('');
  const [plazo, setPlazo] = useState('');
  const [tipoCredito, setTipoCredito] = useState('frances');
  const [resultadoTabla, setResultadoTabla] = useState([]);

  const handleSimular = (e) => {
    e.preventDefault();
    
    // Simulación temporal de datos para probar la vista
    // Más adelante esto será la respuesta real de tu backend .NET
    const datosSimulados = [
      { mes: 1, cuota: 150, capital: 100, interes: 50, saldo: 900 },
      { mes: 2, cuota: 150, capital: 110, interes: 40, saldo: 790 },
    ];
    setResultadoTabla(datosSimulados);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Simulador de Crédito</h2>
      <form onSubmit={handleSimular}>
        <div style={{ marginBottom: '15px' }}>
          <label>Monto a solicitar ($): </label>
          <input type="number" value={monto} onChange={(e) => setMonto(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Plazo (meses): </label>
          <input type="number" value={plazo} onChange={(e) => setPlazo(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Tipo de Amortización: </label>
          <select value={tipoCredito} onChange={(e) => setTipoCredito(e.target.value)} style={{ width: '100%', padding: '8px' }}>
            <option value="frances">Sistema Francés (Cuota Fija)</option>
            <option value="aleman">Sistema Alemán (Cuota Variable)</option>
          </select>
        </div>
        <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#3498db', color: 'white', border: 'none' }}>
          Calcular Tabla
        </button>
      </form>

      {/* Aquí renderizamos la tabla pasándole los datos simulados */}
      <TablaAmortizacion datos={resultadoTabla} />
    </div>
  );
};