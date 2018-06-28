using System;

namespace DemonstratureCM.DTO
{
	public class TermDto
	{
		public int Id { get; set; }
		public int CourseId { get; set; }
		public CourseDto Course { get; set; }
		public int UserId { get; set; }
		public MyUserDto MyUser { get; set; }
		public int GroupId { get; set; }
		public GroupDto Group { get; set; }
		public string TermDate { get; set; }
		public int SuggestedUserId { get; set; }
		public bool ButtonTakeState { get; set; }
		public bool ButtonSkipState { get; set; }
		public bool DemoPickerState { get; set; }
		public int CellState { get; set; }
		public bool IsCourseTerm { get; set; }
	}
}
