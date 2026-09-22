using Microsoft.AspNetCore.Mvc;
using CreditService.Data;
using CreditService.Models;
using CreditService.DTOs;

namespace CreditService.Controllers
{
    [Route("api/credits")]
    [ApiController]
    public class CreditController : ControllerBase
    {
        private readonly CreditDbContext _context;

        public CreditController(CreditDbContext context)
        {
            _context = context;
        }

        [HttpPost("simulate")]
        public IActionResult SimulateCredit([FromBody] SimulationRequestDto request)
        {
            // 1. Determinar la tasa de interés según el tipo de crédito
            decimal interestRate = request.CreditType.ToLower() switch
            {
                "personal" => 0.15m, // 15% anual
                "hipotecario" => 0.08m, // 8% anual
                "vehicular" => 0.12m, // 12% anual
                _ => 0.18m // 18% por defecto
            };

            // 2. Calcular la cuota mensual (Fórmula de amortización francesa)
            decimal monthlyRate = interestRate / 12;
            double mathPower = Math.Pow(1 + (double)monthlyRate, request.TermInMonths);
            decimal monthlyPayment = request.Amount * (monthlyRate * (decimal)mathPower) / ((decimal)mathPower - 1);

            // 3. Crear el registro para la base de datos
            var simulation = new CreditSimulation
            {
                Username = request.Username,
                CreditType = request.CreditType,
                Amount = request.Amount,
                InterestRate = interestRate,
                TermInMonths = request.TermInMonths,
                MonthlyPayment = Math.Round(monthlyPayment, 2)
            };

            // 4. Guardar en la base de datos
            _context.Simulations.Add(simulation);
            _context.SaveChanges();

            return Ok(simulation);
        }

        [HttpGet("history/{username}")]
        public IActionResult GetHistory(string username)
        {
            var history = _context.Simulations
                                  .Where(s => s.Username == username)
                                  .OrderByDescending(s => s.CreatedAt)
                                  .ToList();
            return Ok(history);
        }
    }
}