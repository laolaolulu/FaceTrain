using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FaceTrain.Migrations
{
    public partial class init1115 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Phone",
                table: "UserInfos",
                type: "TEXT",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Phone",
                table: "UserInfos");
        }
    }
}
