using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Extensions;
using api.Interfaces;
using api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/portfolio")]
    [ApiController]
    public class PortfolioController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IPortfolioRepository _portfolioRepository;
        private readonly IFMPService _fmpService;

        private readonly IStockRepository _stockRepository;
        public PortfolioController(UserManager<AppUser> userManager, IPortfolioRepository portfolioRepository, IStockRepository stockRepository, IFMPService fmpService)
        {

            _userManager = userManager;
            _portfolioRepository = portfolioRepository;
            _stockRepository = stockRepository;
            _fmpService = fmpService;

        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetUserPortfolio()
        {
            var userName = User.GetUsername();
            var appUser = await _userManager.FindByNameAsync(userName);
            var userPortfolio = await _portfolioRepository.GetUserPortfolio(appUser!);
            return Ok(userPortfolio);
        }

        [HttpPost("{symbol}")]
        [Authorize]
        public async Task<IActionResult> AddPortfolio(string symbol)
        {
            var username = User.GetUsername();
            var appUser = await _userManager.FindByNameAsync(username);
            var stock = await _stockRepository.GetBySymbol(symbol);
            if (stock == null)
            {
                stock = await _fmpService.FindStockBySymbol(symbol);
                if (stock == null)
                {
                    return BadRequest("Stock does not exist.");
                }
                else
                {

                    await _stockRepository.Add(stock);
                }
            }
            var userPortfolio = await _portfolioRepository.GetUserPortfolio(appUser!);
            if (userPortfolio.Any(x => x.Symbol.ToLower() == symbol.ToLower())) return BadRequest("Cannot add same stock to portfolio");

            var portfolioModel = new Portfolio
            {
                AppUserId = appUser!.Id,
                StockId = stock.Id,
            };
            await _portfolioRepository.Create(portfolioModel);
            if (portfolioModel == null)
            {
                return StatusCode(500, "Could not create");
            }
            else
            {
                return Created();
            }

        }

        [HttpDelete("{symbol}")]
        [Authorize]
        public async Task<IActionResult> DeletePortfolio(string symbol)
        {
            var userName = User.GetUsername();
            var appUser = await _userManager.FindByNameAsync(userName);
            var userPortfolio = await _portfolioRepository.GetUserPortfolio(appUser!);
            var filteredStock = userPortfolio.Where(s => s.Symbol.ToLower() == symbol.ToLower()).ToList();
            if (filteredStock.Count == 1)
            {
                await _portfolioRepository.Delete(appUser!, symbol);
            }
            else
            {
                return BadRequest("Stock not in the portfolio");
            }

            return Ok();
        }
    }
}