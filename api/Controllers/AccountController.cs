using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Security.Claims;
using System.Threading.Tasks;
using api.Dtos.Account;
using api.Extensions;
using api.Interfaces;
using api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.IdentityModel.Tokens;

namespace api.Controllers
{
    [Route("api/account")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly ITokenService _tokenservice;
        private readonly SignInManager<AppUser> _signinManager;
        private readonly IEmailSend _emailSend;


        public AccountController(UserManager<AppUser> userManager, ITokenService tokenService, SignInManager<AppUser> signInManager, IEmailSend emailSend)
        {
            _userManager = userManager;
            _tokenservice = tokenService;
            _signinManager = signInManager;
            _emailSend = emailSend;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);
                var existingUser = await _userManager.FindByEmailAsync(registerDto.Email!);
                if (existingUser != null)
                {
                    return StatusCode(500, "A user with this email already exists.");
                }

                var appUser = new AppUser
                {
                    UserName = registerDto.UserName,
                    Email = registerDto.Email,
                };
                var createdUser = await _userManager.CreateAsync(appUser, registerDto.Password!);
                if (createdUser.Succeeded)
                {
                    var roleResult = await _userManager.AddToRoleAsync(appUser, "User");

                    if (roleResult.Succeeded)
                    {
                        return Ok(new NewUserDto
                        {
                            UserName = appUser.UserName!,
                            Email = appUser.Email!,
                            Token = _tokenservice.CreateToken(appUser)
                        });
                    }
                    else
                    {
                        return StatusCode(500, roleResult.Errors);
                    }
                }
                else
                {
                    return StatusCode(500, createdUser.Errors);
                }

            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto loginDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);

            }
            bool isEmail = loginDto.UserNameOrEmail.IsEmail();
            var user = await _userManager.Users.FirstOrDefaultAsync(x => !isEmail ? x.UserName == loginDto.UserNameOrEmail.ToLower()
                : x.Email == loginDto.UserNameOrEmail

            );
            if (user == null) return Unauthorized("Invalid username or email");
            var result = await _signinManager.CheckPasswordSignInAsync(user, loginDto.Password, false);
            if (!result.Succeeded) return Unauthorized("Username/Email not found and/or password incorrect");
            return Ok(
                new NewUserDto
                {
                    UserName = user.UserName!,
                    Email = user.Email!,
                    Token = _tokenservice.CreateToken(user)
                }
            );
        }
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Invalid email address" });
            }
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null || !await _userManager.IsEmailConfirmedAsync(user))
                return Ok(new { message = "If an account with this email exists, a reset link has been sent." });
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var encodedToken = WebUtility.UrlEncode(token);
            var callbackUrl = $"http://localhost:3000/reset-password?token={encodedToken}&email={model.Email}";
            try
            {
                _emailSend.SendPasswordResetLinkAsync(user, user.Email!, callbackUrl);

            }
            catch (SmtpException ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
            return Ok(new { message = $"A password reset email has been sent. The token : {token}" });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto resetPasswordDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { message = "Invalid data" });
            var user = await _userManager.FindByEmailAsync(resetPasswordDto.Email);
            if (user == null)
                return BadRequest(new { message = "Invalid request" });
            var result = await _userManager.ResetPasswordAsync(user, resetPasswordDto.Token, resetPasswordDto.Password);
            if (!result.Succeeded)
                return BadRequest(new { message = "Failed to reset password" });
            return Ok(new { message = "Pasword has been reset successfully" });
        }

        [HttpPost("refresh-token/{userName}/{token}")]
        public async Task<IActionResult> RefreshToken(string userName, string token)
        {
            var user = await _userManager.Users.FirstOrDefaultAsync(x => x.UserName == userName);
            if (user == null)
                return Unauthorized("User not found");

            var handler = new JwtSecurityTokenHandler();
            JwtSecurityToken jwtToken;
                jwtToken = handler.ReadJwtToken(token);
                var exp = jwtToken.ValidTo;

            if (exp > DateTime.UtcNow)
            {
          
                return Ok(new { message = "token is valid" });

            }
           else
            {
                return Unauthorized(new {message = "Token expired, please login again"});
            }
        }
    }
}
