using DemonstratureBLL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DemonstratureCM.DTO;

namespace DemonstratureAPI.APIControllers
{
    public class UserController : ApiController
    {
        [HttpGet]
        [Route("api/user/all")]
        public IHttpActionResult GetAllUsers()
        {
            var instance = new UserLogic();
            var result = instance.GetAllUsersBLL();
            if (result!=null) { return Ok(result); }
            else { return BadRequest(); }
        }
    }
}
