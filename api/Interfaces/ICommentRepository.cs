using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Comments;
using api.Helpers;
using api.Models;

namespace api.Interfaces
{
    public interface ICommentRepository
    {
        Task<List<Comment>> GetAll(CommentQueryObject commentQueryObject);
        Task<Comment?> GetById(int id);
        Task<Comment> Add(Comment comment);
        Task<Comment?> Update(Comment commentModel, int id);
        Task<bool> Delete(int id);

    }
}