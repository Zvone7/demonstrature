using System;

namespace DemonstratureCM.DTO
{
    public class TermDTO
    {
        public int Id { get; set; }
        public int CourseId { get; set; }
        public CourseDTO Course { get; set; }
        public int UserId { get; set; }
        public MyUserDTO UserPerson { get; set; }
        public int GroupId { get; set; }
        public GroupDTO Group { get; set; }
        public DateTime TermDate { get; set; }
    }
}
