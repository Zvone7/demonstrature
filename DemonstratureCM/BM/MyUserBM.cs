using DemonstratureCM.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemonstratureCM.BM
{
    public class MyUserBm
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Name { get; set; }
        public string LastName { get; set; }
        public string Role { get; set; }
		public bool IsActive { get; set; }
		public List<CourseDto> Courses{ get; set; }
    }
}
