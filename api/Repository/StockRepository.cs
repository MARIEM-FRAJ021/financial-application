using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using api.Data;
using api.Dtos.Stocks;
using api.Helpers;
using api.Interfaces;
using api.Mappers;
using api.Models;
using api.Stocks;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace api.Repository
{
    public class StockRepository : IStockRepository
    {
        private readonly ApplicationDBContext _context;
        public StockRepository(ApplicationDBContext context) => _context = context;
        public async Task<List<Stock>> GetAll(QueryObject queryObject)
        {
            var stocks = _context.Stocks.Include(c => c.Comments).ThenInclude(x => x.AppUser).AsQueryable();
            if (!string.IsNullOrWhiteSpace(queryObject.CompanyName))
            {
                stocks = stocks.Where(c => c.CompanyName.Contains(queryObject.CompanyName));
            }
            if (!string.IsNullOrWhiteSpace(queryObject.Symbol))
            {
                stocks = stocks.Where(s => s.Symbol.Contains(queryObject.Symbol));
            }
            if (!string.IsNullOrWhiteSpace(queryObject.SortBy))
            {
                Expression<Func<Stock, object>>? keySelector = queryObject.SortBy.ToLower() switch
                {
                    "symbol" => c => c.Symbol,
                    "companyname" => c => c.CompanyName,
                    _ => null
                };

                if (keySelector != null)
                {
                    stocks = queryObject.IsDescending
                        ? stocks.OrderByDescending(keySelector)
                        : stocks.OrderBy(keySelector);
                }

            }
            var skipNumber = (queryObject.PageNumber - 1) * queryObject.PageSize;
            return await stocks.Skip(skipNumber).Take(queryObject.PageSize).ToListAsync();
        }

        public async Task<Stock?> GetById(int id)
        {
            var stock = await _context.Stocks.Include(c => c.Comments).FirstOrDefaultAsync(x => x.Id == id);
            return stock;
        }
        public async Task<Stock> Add(Stock stock)
        {
            await _context.Stocks.AddAsync(stock);
            await _context.SaveChangesAsync();
            return stock;
        }

        public async Task<Stock?> Update(int id, UpdateStockDto updateDto)
        {
            var stockModel = await _context.Stocks.FirstOrDefaultAsync(x => x.Id == id);
            if (stockModel == null)
                return null;

            stockModel.Symbol = updateDto.Symbol;
            stockModel.CompanyName = updateDto.CompanyName;
            stockModel.Purchase = updateDto.Purchase;
            stockModel.LastDiv = updateDto.LastDiv;
            stockModel.Industry = updateDto.Industry;
            stockModel.MarketCap = updateDto.MarketCap;

            await _context.SaveChangesAsync();
            return stockModel;
        }

        public async Task<bool> Delete(int id)
        {
            var stockModel = await _context.Stocks.FirstOrDefaultAsync(x => x.Id == id);

            if (stockModel != null)
            {

                _context.Stocks.Remove(stockModel);
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<bool> StockExists(int id)
        {
            return await _context.Stocks.AnyAsync(x => x.Id == id);
        }

        public async Task<Stock?> GetBySymbol(string symbol)
        {
            return await _context.Stocks.FirstOrDefaultAsync(s => s.Symbol == symbol);
        }

    }
}