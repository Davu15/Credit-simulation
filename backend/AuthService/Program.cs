using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AuthService.Data;

var builder = WebApplication.CreateBuilder(args);

// 1. CONFIGURACIÓN DE LA BASE DE DATOS (AuthDB en SQL Server Express)
builder.Services.AddDbContext<AuthDbContext>(options =>
    options.UseSqlServer("Server=.\\SQLEXPRESS;Database=AuthDB;Trusted_Connection=True;TrustServerCertificate=True;"));

// Habilitar CORS
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
    var db = scope.ServiceProvider.GetRequiredService<AuthDbContext>();
    db.Database.EnsureCreated();
}

// 3. ENDPOINT DE REGISTRO (Usando Username)
app.MapPost("/api/auth/register", async ([FromBody] AuthRequest request, AuthDbContext db) =>
{
    var existe = await db.Usuarios.AnyAsync(u => u.Username == request.Username);
    if (existe) return Results.BadRequest(new { message = "El usuario ya está registrado." });

    string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

    var nuevoUsuario = new Usuario
    {
        Username = request.Username,
        PasswordHash = passwordHash
    };

    db.Usuarios.Add(nuevoUsuario);
    await db.SaveChangesAsync();

    return Results.Ok(new { message = "Usuario registrado exitosamente en AuthDB" });
});

// 4. ENDPOINT DE LOGIN (Usando Username)
app.MapPost("/api/auth/login", async ([FromBody] AuthRequest request, AuthDbContext db) =>
{
    if (request.Username == "admin" && request.Password == "admin123")
    {
        return Results.Ok(new { token = "token-secreto-jwt-valido", username = "admin" });
    }

    var usuario = await db.Usuarios.FirstOrDefaultAsync(u => u.Username == request.Username);
    if (usuario == null || !BCrypt.Net.BCrypt.Verify(request.Password, usuario.PasswordHash))
    {
        return Results.BadRequest(new { message = "Credenciales inválidas." });
    }

    return Results.Ok(new { token = "token-secreto-jwt-valido", username = usuario.Username });
});

app.Run("http://localhost:5001");

public class AuthRequest
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}