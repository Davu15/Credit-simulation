export const TablaAmortizacion = ({ datos }) => {
  if (!datos || datos.length === 0) return null;

  return (
    <div style={{ marginTop: '30px' }}>
      <h3>Tabla de Amortización</h3>
      <button style={{ marginBottom: '15px', padding: '8px 15px', backgroundColor: '#e74c3c', color: 'white', border: 'none', cursor: 'pointer' }}>
        Exportar a PDF
      </button>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Mes</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Cuota</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Capital</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Interés</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Saldo</th>
          </tr>
        </thead>
        <tbody>
          {datos.map((fila) => (
            <tr key={fila.mes}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{fila.mes}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>${fila.cuota.toFixed(2)}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>${fila.capital.toFixed(2)}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>${fila.interes.toFixed(2)}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>${fila.saldo.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};