using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using api.Interfaces;
using api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;

namespace api.Service
{

    public class EmailSend : IEmailSend
    {
        private readonly IConfiguration _config;

        public EmailSend(IConfiguration config)
        {
            _config = config;
        }
        public void SendPasswordResetLinkAsync(AppUser user, string email, string resetLink) =>

          SendEmailAsync(email, "Reset Password",
                $"Click <a href='{resetLink}'>here</a> to reset your password.");

        public void SendConfirmationLinkAsync(AppUser user, string email, string confirmationLink) =>
           SendEmailAsync(email, "Confirm your email", $"Please confirm your account by <a href='{confirmationLink}'>clicking here</a>.");
        public void SendPasswordResetCodeAsync(AppUser user, string email, string resetCode) =>
            SendEmailAsync(email, "Reset your password", $"Please reset your password using the following code: {resetCode}");



        private void SendEmailAsync(string email, string subject, string htmlMessage)
        {
            var host = _config["EmailSettings:Host"];
            var port = int.Parse(_config["EmailSettings:Port"]!);
            var user = _config["EmailSettings:Username"];
            var pass = _config["EmailSettings:Password"];

            var message = new MailMessage(user!, email, subject, htmlMessage)
            {
                IsBodyHtml = true
            };

            using var client = new SmtpClient(host, port)
            {
                Credentials = new NetworkCredential(user, pass),
                EnableSsl = true,
            Timeout = 10000
            };

            message.To.Add(email);
            client.Send(message);
        }
    }
}