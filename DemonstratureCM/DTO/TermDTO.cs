using System;

namespace DemonstratureCM.DTO
{
    public class TermDTO
    {
        public int Id { get; set; }
        public int IdCollegeCourse { get; set; }
        public int IdUser { get; set; }
        public int IdGroup { get; set; }
        public GroupDTO Group { get; set; }
        public DateTime TermDate { get; set; }
        public bool IsAvailable { get; set; }
        public string UserFullName { get; set; }
    }
}
