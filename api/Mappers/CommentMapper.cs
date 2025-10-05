using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Comments;
using api.Models;

namespace api.Mappers
{
    public static class CommentMapper
    {
        public static CommentDto ToCommentDto(this Comment commentModel)
        {
            return new CommentDto
            {
                Id = commentModel.Id,
                Title = commentModel.Title,
                Content = commentModel.Content,
                CreatedOn = commentModel.CreatedOn,
                CreatedBy = commentModel.AppUser.UserName!,
                StockId = commentModel.StockId
            };
        }

        public static Comment ToCommentFromCreateDto(this CreateCommentDto commentRequestDto, int stockId, string userId)
        {
            return new Comment
            {
                Title = commentRequestDto.Title,
                Content = commentRequestDto.Content,
                StockId = stockId,
                AppUserId = userId
            };
        }

        public static Comment ToCommentFromUpdateDto(this UpdateCommentDto commentRequestDto, int stockId)
        {
            return new Comment
            {
                Title = commentRequestDto.Title,
                Content = commentRequestDto.Content
            };
        }

    }
}