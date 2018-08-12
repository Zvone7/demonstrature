/*
DROP TABLE CourseUserT;
DROP TABLE TermT;
DROP TABLE GroupT;
DROP TABLE CourseT;
DROP TABLE UserT;
*/
CREATE TABLE [dbo].[CourseT](
	[Id] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
	[Name] [varchar](100) NULL,
	[Study] [varchar](100) NOT NULL,
	[Professor] [varchar](100) NULL,
	[Asistant] [varchar](100) NULL,
	[IsActive] [bit] NOT NULL,
	);

CREATE TABLE [dbo].[UserT](
	[Id] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
	[Username] [varchar](50) NOT NULL,
	[Name] [varchar](100) NOT NULL,
	[LastName] [varchar](100) NOT NULL,
	[Password] [varchar](256) NOT NULL,
	[Salt] [varchar](256) NOT NULL,
	[Role] [varchar](100) NOT NULL,
	[IsActive] [bit] NOT NULL
	);

CREATE TABLE [dbo].[GroupT](
	[Id] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
	[Name] [varchar](100) NOT NULL,
	[CourseId] [int] NOT NULL,
	[OwnerId] [int] NULL,
	CONSTRAINT FkGroupOwner FOREIGN KEY (OwnerId) REFERENCES [UserT](Id) ON DELETE NO ACTION ON UPDATE CASCADE,
	CONSTRAINT FkGroupCourse FOREIGN KEY (CourseId) REFERENCES [CourseT](Id) ON DELETE NO ACTION ON UPDATE CASCADE,
	);

CREATE TABLE [dbo].[TermT](
	[Id] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
	[CourseId] [int] NOT NULL,
	[UserId] [int] NULL,
	[GroupId] [int] NOT NULL,
	[TermDate] [date] NULL,
	[SuggestedUserId] [int] NULL,
	CONSTRAINT FkTermCourse FOREIGN KEY (CourseId) REFERENCES CourseT(Id) ON DELETE NO ACTION ON UPDATE CASCADE,
	CONSTRAINT FkTermUser FOREIGN KEY (UserId) REFERENCES UserT(Id) ON DELETE NO ACTION ON UPDATE NO ACTION,
	CONSTRAINT FkTermGroup FOREIGN KEY (GroupId) REFERENCES GroupT(Id) ON DELETE NO ACTION ON UPDATE NO ACTION
	);

CREATE TABLE [dbo].[CourseUserT](
	[Id][int] IDENTITY(1,1) PRIMARY KEY NOT NULL,	
	[CourseId] [int] NOT NULL,
	[UserId] [int] NOT NULL,
	CONSTRAINT FkCourseUserCourse FOREIGN KEY (CourseId) REFERENCES CourseT(Id) ON DELETE NO ACTION ON UPDATE CASCADE,
	CONSTRAINT FkCourseUserUser FOREIGN KEY (UserId) REFERENCES UserT(Id) ON DELETE NO ACTION ON UPDATE CASCADE
	);
	

INSERT [dbo].[UserT] ([Username], [Name], [LastName], [Password], [Salt], [Role], [IsActive]) VALUES (N'admin', N'admin', N'admin', N'$2a$11$XzDmyAcdyyXuK5.lcKky8.f6Gle8yVpnFWbp7WRnNJM6VSBqPU8hW', N'$2a$11$XzDmyAcdyyXuK5.lcKky8.', N'Administrator', 1)
GO
SET IDENTITY_INSERT [dbo].[UserT] OFF
GO

INSERT [dbo].[CourseT]([Study],[IsActive]) VALUES (N'Elektrotehnika', 0)
INSERT [dbo].[CourseT]([Study],[IsActive]) VALUES (N'Racunarstvo', 0)
--INSERT [dbo].[CourseT]([Study],[IsActive]) VALUES (N'Elektrotehnika', 0)
--INSERT [dbo].[CourseT]([Study],[IsActive]) VALUES (N'Elektrotehnika', 0)
--INSERT [dbo].[CourseT]([Study],[IsActive]) VALUES (N'Elektrotehnika', 0)
