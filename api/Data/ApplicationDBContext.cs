using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using api.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace api.Data
{
    public class ApplicationDBContext : IdentityDbContext<AppUser>
    {
        public ApplicationDBContext(DbContextOptions dbContextOptions) : base(dbContextOptions)
        {

        }

        public DbSet<Stock> Stocks { get; set; }
        public DbSet<Comment> Comments { get; set; }

        public DbSet<Portfolio> Portfolios { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Portfolio>(x => x.HasKey(p => new { p.AppUserId, p.StockId }));

            builder.Entity<Portfolio>()
            .HasOne(x => x.Stock)
            .WithMany(x => x.Portfolios)
            .HasForeignKey(x => x.StockId);
            
            builder.Entity<Portfolio>()
            .HasOne(x=>x.AppUser)
            .WithMany(x=> x.Portfolios)
            .HasForeignKey (p=>p.AppUserId);


            List<IdentityRole> roles = new List<IdentityRole>
            {
                new IdentityRole {
                    Id= "1",
                    Name = "Admin",
                    NormalizedName = "ADMIN",
                },
                new IdentityRole {
                    Id="2",
                    Name = "User",
                    NormalizedName = "USER",
                }
            };
            builder.Entity<IdentityRole>().HasData(roles);

        }

    }

}