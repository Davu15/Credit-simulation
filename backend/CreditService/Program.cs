using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

// Habilitar CORS temporalmente en este servicio por si las peticiones pasan directas
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

var app = builder.Build();
app.UseCors("AllowAll");

// Endpoint para calcular la simulación
app.MapPost("/api/credit/simulate", ([FromBody] SimulationRequest request) =>
{
    // 1. Asignar tasas de interés según el tipo de crédito
    double tasaAnual = 0.045; // 4.5% Vivienda por defecto
    if (request.TipoCredito == "Vehículo") tasaAnual = 0.08;
    if (request.TipoCredito == "Consumo") tasaAnual = 0.12;
    if (request.TipoCredito == "Educativo") tasaAnual = 0.07;

    double tasaMensual = tasaAnual / 12;
    int meses = request.Plazo * 12;
    
    // 2. Fórmula de cuota fija (Sistema Francés)
    double cuota = request.Monto * (tasaMensual * Math.Pow(1 + tasaMensual, meses)) / (Math.Pow(1 + tasaMensual, meses) - 1);
    
    var tabla = new List<object>();
    double saldo = request.Monto;
    DateTime fecha = DateTime.Now;

    // 3. Generar la tabla de amortización mes a mes
    for (int i = 1; i <= meses; i++)
    {
        fecha = fecha.AddMonths(1);
        double interes = saldo * tasaMensual;
        double capital = cuota - interes;
        saldo -= capital;
        
        if (saldo < 0) saldo = 0; // Evitar decimales negativos al final

        tabla.Add(new {
            cuota = i,
            fecha = fecha.ToString("dd/MM/yyyy"),
            valor = Math.Round(cuota, 2),
            interes = Math.Round(interes, 2),
            capital = Math.Round(capital, 2),
            saldo = Math.Round(saldo, 2)
        });
    }

    // 4. Devolver la respuesta a React
    return Results.Ok(new {
        monto = request.Monto,
        plazo = request.Plazo,
        cuotaMensual = Math.Round(cuota, 2),
        tabla = tabla
    });
});

app.Run("http://localhost:5002");

// Estructura de los datos que envía React
public class SimulationRequest
{
    public string TipoCredito { get; set; } = string.Empty;
    public double Monto { get; set; }
    public int Plazo { get; set; }
    public string SistemaAmortizacion { get; set; } = string.Empty;
    public bool SeguroDesgravamen { get; set; }
    public bool SeguroIncendio { get; set; }
}