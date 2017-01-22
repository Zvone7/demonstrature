using DemonstratureCM.BM;
using DemonstratureCM.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemonstratureCM.Auth
{
    public class AuthTermDTO
    {
        public LoginDataBM LoginData { get; set; }
        public TermDTO Term { get; set; }
    }
}
