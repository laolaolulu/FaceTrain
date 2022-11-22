using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using System.Reflection;

namespace FaceTrain.Models
{
    public class AppDbContext : DbContext
    {
        public virtual DbSet<UserInfo> UserInfos { get; set; }

        /// <summary>
        /// 重载配置
        /// </summary>
        /// <param name="optionsBuilder"></param>
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            //  string baseDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
         //   var se1 = "Data source=" + Directory.GetCurrentDirectory() + "\\face.db";
            optionsBuilder.UseSqlite("Data source="+ Directory.GetCurrentDirectory() + "\\face.db");
           
            // optionsBuilder.UseSqlite("Data source=" + AppContext.BaseDirectory + "face.db");
            //   optionsBuilder.UseSqlite("Data source=C:\\code\\FaceTrain\\face.db");
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="builder"></param>
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
        }
    }
}
