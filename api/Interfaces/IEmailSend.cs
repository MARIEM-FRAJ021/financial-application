using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api.Interfaces
{
    public interface IEmailSend
    {
        void SendConfirmationLinkAsync(AppUser user, string email, string confirmationLink);

        void SendPasswordResetLinkAsync(AppUser user, string email, string resetLink);

        void SendPasswordResetCodeAsync(AppUser user, string email, string resetCode);
    }
}