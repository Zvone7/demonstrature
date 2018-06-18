using DemonstratureCM.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemonstratureCM.BM
{
    public class CourseBm
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Professor { get; set; }
        public string Asistant { get; set; }
        public bool IsActive { get; set; }
        public TermDto[][] TermT { get; set; }
        public string Study { get; set; }
    }
}
