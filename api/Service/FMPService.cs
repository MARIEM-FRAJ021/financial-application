using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Stocks;
using api.Interfaces;
using api.Mappers;
using api.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace api.Service
{
    public class FMPService : IFMPService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _config;
        private readonly ILogger<FMPService> _logger;

        public FMPService(HttpClient httpClient, IConfiguration config, ILogger<FMPService> logger)
        {
            _httpClient = httpClient;
            _config = config;
            _logger = logger;
        }

        public async Task<Stock?> FindStockBySymbol(string symbol)
        {
            try
            {
                var url = $"https://financialmodelingprep.com/stable/profile?symbol={symbol}&apikey={_config["FMPKey"]}";
                var result = await _httpClient.GetAsync(url);

                if (!result.IsSuccessStatusCode)
                {
                    return null;
                }

                var content = await result.Content.ReadAsStringAsync();
                var stockFmp = JsonConvert.DeserializeObject<FMPStock[]>(content)?.FirstOrDefault();
                return stockFmp?.ToStockFromFMPStock();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }
    }

}

