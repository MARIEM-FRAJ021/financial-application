using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Stocks;
using api.Helpers;
using api.Models;
using api.Stocks;

namespace api.Interfaces
{
    public interface IStockRepository
    {
        Task<List<Stock>> GetAll(QueryObject queryObject);
        Task<Stock?> GetById(int id);
        Task<Stock> Add(Stock stock);
        Task<Stock?> Update(int id, UpdateStockDto stockDto);
        Task<bool> Delete(int id);
        Task<bool> StockExists(int id);
        Task<Stock?> GetBySymbol(string symbol);
    }
}