using DemonstratureCM.BM;
using DemonstratureCM.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemonstratureCM.Auth
{
    public class AuthGroupDTO
    {
        public LoginDataBM LoginData { get; set; }
        public GroupDTO Group { get; set; }
    }
}
