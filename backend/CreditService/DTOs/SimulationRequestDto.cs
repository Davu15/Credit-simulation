namespace CreditService.DTOs
{
    public class SimulationRequestDto
    {
        public string Username { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string CreditType { get; set; } = string.Empty;
        public int TermInMonths { get; set; }
    }
}