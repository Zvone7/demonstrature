using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemonstratureCM.DTO
{
    public class GroupDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int OwnerId { get; set; }
        public int CourseId { get; set; }
    }
}
