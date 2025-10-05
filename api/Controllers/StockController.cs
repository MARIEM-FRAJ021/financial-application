using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Dtos.Stocks;
using api.Helpers;
using api.Interfaces;
using api.Mappers;
using api.Models;
using api.Stocks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [Route("api/stock")]
    [ApiController]
    public class StockController : ControllerBase
    {
        private readonly IStockRepository _repo;

        public StockController(IStockRepository repo)
        {
            _repo = repo;
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult> GetAll([FromQuery] QueryObject query)
        {
            var stocks = await _repo.GetAll(query);
            var stockDtos = stocks.Select(s=> s.ToStockDto()).ToList();
            return Ok(stockDtos);
        }
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var stock = await _repo.GetById(id);
            if (stock == null)
            {
                return NotFound();
            }

            return Ok(stock);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateStockRequestDto stockDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var stockModel = stockDto.ToStockFromCreateDto();
            var stock = await _repo.Add(stockModel);
            return CreatedAtAction(nameof(GetById), new { id = stock.Id }, stock);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<ActionResult> Update([FromRoute] int id, [FromBody] UpdateStockDto updateDto)
        {
            if(!ModelState.IsValid) 
               return BadRequest(ModelState);
            var stockDto = await _repo.Update(id, updateDto);
            if (stockDto == null)
            {
                return NotFound();
            }

            return Ok(stockDto);
        }
        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            var result = await _repo.Delete(id);
            if (!result)
            {
                return NotFound();
            }
            else
            {
                return NoContent();

            }
        }
    }
}