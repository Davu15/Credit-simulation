using Microsoft.EntityFrameworkCore;
using CreditService.Models;

namespace CreditService.Data
{
    public class CreditDbContext : DbContext
    {
        public CreditDbContext(DbContextOptions<CreditDbContext> options) : base(options) { }

        public DbSet<CreditSimulation> Simulations { get; set; }
    }
}