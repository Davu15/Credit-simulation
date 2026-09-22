using Microsoft.EntityFrameworkCore;
using CreditService.Data;

var builder = WebApplication.CreateBuilder(args);

// Configurar la conexión a la base de datos de Créditos
builder.Services.AddDbContext<CreditDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();

var app = builder.Build();

app.UseAuthorization();
app.MapControllers();

app.Run();