using System;

namespace CreditService.Models
{
    public class CreditSimulation
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string CreditType { get; set; } = string.Empty; 
        public decimal Amount { get; set; } 
        public decimal InterestRate { get; set; } 
        public int TermInMonths { get; set; } 
        public decimal MonthlyPayment { get; set; } 
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}