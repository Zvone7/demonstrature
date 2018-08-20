using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DemonstratureAPI.Models
{
    public class MyUserWithReturnUrl
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Name { get; set; }
        public string Role { get; set; }
        public string ReturnUrl { get; set; }
    }
}