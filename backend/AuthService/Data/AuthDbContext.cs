using Microsoft.EntityFrameworkCore;

namespace AuthService.Data
{
    public class AuthDbContext : DbContext
    {
        public AuthDbContext(DbContextOptions<AuthDbContext> options) : base(options) { }

        public DbSet<Usuario> Usuarios => Set<Usuario>();
    }

    public class Usuario
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty; // <-- Cambiado de Email a Username
        public string PasswordHash { get; set; } = string.Empty;
        public DateTime FechaRegistro { get; set; } = DateTime.Now;
    }
}