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
        public string TermDate { get; set; }
        public int SuggestedUserId { get; set; }
        public bool ButtonTakeState { get; set; }
        public bool ButtonSkipState { get; set; }
        public bool DemoPickerState { get; set; }
        public int CellState { get; set; }
    }
}
