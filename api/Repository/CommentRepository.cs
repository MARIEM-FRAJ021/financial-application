using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Dtos.Comments;
using api.Helpers;
using api.Interfaces;
using api.Mappers;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repository
{
    public class CommentRepository : ICommentRepository
    {
        private readonly ApplicationDBContext _context;

        public CommentRepository(ApplicationDBContext context) => _context = context;

        public async Task<List<Comment>> GetAll(CommentQueryObject commentQueryObject)
        {
            var comments = _context.Comments.Include(x => x.AppUser).AsQueryable();
            if (!string.IsNullOrWhiteSpace(commentQueryObject.Symbol))
            {
                comments = comments.Where(x => x.Stock!.Symbol.ToLower()==commentQueryObject.Symbol.ToLower() && x.CreatedOn.Year== DateTime.Now.Year);
            }
            if (commentQueryObject.IsDescending == true)
            {
                comments = comments.OrderByDescending(x => x.CreatedOn);
            }
            else
            {
                comments = comments.OrderBy(x => x.CreatedOn);
            }
            return await comments.ToListAsync();
        }
        public async Task<Comment?> GetById(int id)
        {
            return await _context.Comments.Include(x=> x.AppUser).FirstOrDefaultAsync(x=> x.Id == id);
        }

        public async Task<Comment> Add(Comment comment)
        {
            await _context.Comments.AddAsync(comment);
            await _context.SaveChangesAsync();
            return comment;
        }

        public async Task<Comment?> Update(Comment commentModel, int id)
        {
            var existingComment = await _context.Comments.FindAsync(id);
            if (existingComment == null)
                return null;
            existingComment.Title = commentModel.Title;
            existingComment.Content = commentModel.Content;

            await _context.SaveChangesAsync();
            return existingComment;

        }

        public async Task<bool> Delete(int id)
        {
            var commentModel = await _context.Comments.FirstOrDefaultAsync(x => x.Id == id);

            if (commentModel != null)
            {
                _context.Comments.Remove(commentModel);
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }

    }
}