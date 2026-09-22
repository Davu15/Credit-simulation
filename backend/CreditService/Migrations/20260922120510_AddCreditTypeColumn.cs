using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CreditService.Migrations
{
    /// <inheritdoc />
    public partial class AddCreditTypeColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CreditType",
                table: "Simulations",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreditType",
                table: "Simulations");
        }
    }
}
