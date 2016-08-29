using System;

namespace DemonstratureCM.DTO
{
    public class TermDTO
    {
        public int Id { get; set; }
        public int IdCollegeCourse { get; set; }
        public int IdUser { get; set; }
        public DateTime Date { get; set; }
        public bool IsAvailable { get; set; }
    }
}
