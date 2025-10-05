using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Comments;
using api.Extensions;
using api.Helpers;
using api.Interfaces;
using api.Mappers;
using api.Models;
using api.Stocks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Client;

namespace api.Controllers
{
    [Route("api/Comment")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        private readonly ICommentRepository _commentRepository;
        private readonly IStockRepository _stockRepository;

        private readonly UserManager<AppUser> _userManager;
        private readonly IFMPService _fmpService;

        public CommentController(ICommentRepository commentRepository, IStockRepository stockRepository, UserManager<AppUser> userManager, IFMPService fmpService)
        {
            _commentRepository = commentRepository;
            _stockRepository = stockRepository;
            _userManager = userManager;
            _fmpService = fmpService;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAll([FromQuery] CommentQueryObject commentQueryObject)
        {
            var comments = await _commentRepository.GetAll(commentQueryObject);
            var commentDtos = comments.Select(x => x.ToCommentDto());
            return Ok(commentDtos);
        }

        [HttpGet("{id:int}")]
        [Authorize]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var comment = await _commentRepository.GetById(id);
            if (comment == null)
            {
                return NotFound();
            }
            return Ok(comment);
        }

        [HttpPost]
        [Route("{symbol}")]
        [Authorize]
        public async Task<IActionResult> Add([FromBody] CreateCommentDto createCommentDto, [FromRoute] string symbol)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
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
            var userName = User.GetUsername();
            var user = await _userManager.FindByNameAsync(userName);
            var commentModel = createCommentDto.ToCommentFromCreateDto(stock.Id, user!.Id);

            var comment = await _commentRepository.Add(commentModel);

            return CreatedAtAction(nameof(GetById), new { id = comment.Id }, comment.ToCommentDto());
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update([FromBody] UpdateCommentDto updateCommentDto, [FromRoute] int id)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var commentUpdated = await _commentRepository.Update(updateCommentDto.ToCommentFromUpdateDto(id), id);
            if (commentUpdated == null)
            {
                return NotFound();
            }

            return Ok(commentUpdated.ToCommentDto());


        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            bool isDeleted = await _commentRepository.Delete(id);
            if (!isDeleted)
            {
                return NotFound();
            }
            return NoContent();
        }
    }
}