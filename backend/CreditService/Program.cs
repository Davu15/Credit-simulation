using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 1. CONFIGURACIÓN DE LA BASE DE DATOS (SQLite)
// 1. CONFIGURACIÓN DE LA BASE DE DATOS (SQL Server)
builder.Services.AddDbContext<CreditDbContext>(options =>
    options.UseSqlServer("Server=.\\SQLEXPRESS;Database=CreditDb;Trusted_Connection=True;TrustServerCertificate=True;"));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

var app = builder.Build();
app.UseCors("AllowAll");

// 2. CREACIÓN AUTOMÁTICA DE LA TABLA AL ARRANCAR
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<CreditDbContext>();
    db.Database.EnsureCreated();
}

// 3. ENDPOINT: Calcular y GUARDAR Simulación
app.MapPost("/api/credit/simulate", async ([FromBody] SimulationRequest request, CreditDbContext db) =>
{
    double tasaAnual = 0.045; 
    if (request.TipoCredito == "Vehículo") tasaAnual = 0.08;
    if (request.TipoCredito == "Consumo") tasaAnual = 0.12;
    if (request.TipoCredito == "Educativo") tasaAnual = 0.07;

    double tasaMensual = tasaAnual / 12;
    int meses = request.Plazo * 12;
    
    var tabla = new List<object>();
    double saldo = request.Monto;
    DateTime fecha = DateTime.Now;
    double cuotaReferencial = 0;

    if (request.SistemaAmortizacion == "Aleman")
    {
        double capitalFijo = request.Monto / meses;
        for (int i = 1; i <= meses; i++)
        {
            fecha = fecha.AddMonths(1);
            double interes = saldo * tasaMensual;
            double cuota = capitalFijo + interes;
            if (i == 1) cuotaReferencial = cuota; 

            saldo -= capitalFijo;
            if (saldo < 0.01) saldo = 0; 

            tabla.Add(new {
                cuota = i, fecha = fecha.ToString("dd/MM/yyyy"),
                valor = Math.Round(cuota, 2), interes = Math.Round(interes, 2),
                capital = Math.Round(capitalFijo, 2), saldo = Math.Round(saldo, 2)
            });
        }
    }
    else 
    {
        double cuotaFija = request.Monto * (tasaMensual * Math.Pow(1 + tasaMensual, meses)) / (Math.Pow(1 + tasaMensual, meses) - 1);
        cuotaReferencial = cuotaFija;

        for (int i = 1; i <= meses; i++)
        {
            fecha = fecha.AddMonths(1);
            double interes = saldo * tasaMensual;
            double capital = cuotaFija - interes;
            saldo -= capital;
            if (saldo < 0.01) saldo = 0; 

            tabla.Add(new {
                cuota = i, fecha = fecha.ToString("dd/MM/yyyy"),
                valor = Math.Round(cuotaFija, 2), interes = Math.Round(interes, 2),
                capital = Math.Round(capital, 2), saldo = Math.Round(saldo, 2)
            });
        }
    }

    // --- GUARDAR EN LA BASE DE DATOS ---
    var historial = new HistorialSimulacion
    {
        TipoCredito = request.TipoCredito,
        Monto = request.Monto,
        Plazo = request.Plazo,
        SistemaAmortizacion = request.SistemaAmortizacion,
        CuotaAproximada = Math.Round(cuotaReferencial, 2),
        Fecha = DateTime.Now
    };
    
    db.Simulaciones.Add(historial);
    await db.SaveChangesAsync();

    return Results.Ok(new {
        monto = request.Monto, plazo = request.Plazo,
        cuotaMensual = Math.Round(cuotaReferencial, 2), tabla = tabla
    });
});

// 4. NUEVO ENDPOINT: Consultar el historial de simulaciones
app.MapGet("/api/credit/history", async (CreditDbContext db) =>
{
    // Ordenamos para que las simulaciones más recientes salgan primero
    var historial = await db.Simulaciones.OrderByDescending(s => s.Fecha).ToListAsync();
    return Results.Ok(historial);
});

app.Run("http://localhost:5002");

// --- CLASES Y MODELOS ---
public class SimulationRequest
{
    public string TipoCredito { get; set; } = string.Empty;
    public double Monto { get; set; }
    public int Plazo { get; set; }
    public string SistemaAmortizacion { get; set; } = string.Empty;
    public bool SeguroDesgravamen { get; set; }
    public bool SeguroIncendio { get; set; }
}

// Modelo de la Tabla Relacional
public class HistorialSimulacion
{
    public int Id { get; set; }
    public string TipoCredito { get; set; } = string.Empty;
    public double Monto { get; set; }
    public int Plazo { get; set; }
    public string SistemaAmortizacion { get; set; } = string.Empty;
    public double CuotaAproximada { get; set; }
    public DateTime Fecha { get; set; }
}

// Contexto de Base de Datos
public class CreditDbContext : DbContext
{
    public CreditDbContext(DbContextOptions<CreditDbContext> options) : base(options) { }
    public DbSet<HistorialSimulacion> Simulaciones => Set<HistorialSimulacion>();
}