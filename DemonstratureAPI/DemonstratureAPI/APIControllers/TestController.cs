using DemonstratureBLL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace DemonstratureAPI.APIControllers
{
    public class TestController : ApiController
    {
        [HttpGet]
        [Route("api/test")]
        public IHttpActionResult TestValues([FromUri]string x)
        {
            var instance = new UserLogic();
            instance.Test();
            if (x != "")
            {
                return Ok(x);
            }
            else
            {
                return BadRequest();
            }
        }
    }
}
