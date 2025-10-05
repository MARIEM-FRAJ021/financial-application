using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos.Comments
{
    public class UpdateCommentDto
    {
        [Required]
        [MinLength(5, ErrorMessage = "Title must be characters")]
        [MaxLength(280, ErrorMessage = "Title cannot be over 280 ")]
        public string Title { get; set; } = string.Empty;
        [Required]
        [MinLength(5, ErrorMessage = "Title must be characters")]
        [MaxLength(280, ErrorMessage = "Title cannot be over 280 ")]
        public string Content { get; set; } = string.Empty;
    }
}