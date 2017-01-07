/*
DROP TABLE CourseUserT;
DROP TABLE TermT;
DROP TABLE GroupT;
DROP TABLE CourseT;
DROP TABLE UserT;
*/
CREATE TABLE [dbo].[CourseT](
	[Id] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
	[Name] [varchar](100) NOT NULL,
	[Study] [varchar](100) NOT NULL,
	[Professor] [varchar](100) NOT NULL,
	[Asistant] [varchar](100) NOT NULL,
	[IsActive] [bit] NOT NULL,
	);

CREATE TABLE [dbo].[UserT](
	[Id] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
	[Username] [varchar](50) NOT NULL,
	[Name] [varchar](100) NOT NULL,
	[LastName] [varchar](100) NOT NULL,
	[Password] [varchar](100) NOT NULL,
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
	[TermDate] [date],
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
	

USE [Demonstrature]
GO
SET IDENTITY_INSERT [dbo].[CourseT] ON 

GO
INSERT [dbo].[CourseT] ([Id], [Name], [Study], [Professor], [Asistant], [IsActive]) VALUES (1, N'Programiranje 1', N'Raèunarstvo', N'Martinoviæ', N'Leventiæ', 1)
GO
INSERT [dbo].[CourseT] ([Id], [Name], [Study], [Professor], [Asistant], [IsActive]) VALUES (2, N'Fizika 1', N'Elektrotehnika', N'Martinoviæ', N'Leventiæ', 1)
GO
INSERT [dbo].[CourseT] ([Id], [Name], [Study], [Professor], [Asistant], [IsActive]) VALUES (3, N'Programiranje 2', N'Raèunarstvo', N'Martinoviæ', N'Leventiæ', 1)
GO
INSERT [dbo].[CourseT] ([Id], [Name], [Study], [Professor], [Asistant], [IsActive]) VALUES (4, N'Programiranje 2', N'Elektrotehnika', N'Martinoviæ', N'Leventiæ', 1)
GO
SET IDENTITY_INSERT [dbo].[CourseT] OFF
GO
SET IDENTITY_INSERT [dbo].[UserT] ON 

GO
INSERT [dbo].[UserT] ([Id], [Username], [Name], [LastName], [Password], [Role], [IsActive]) VALUES (1, N'zgrubisic', N'Zvonimir', N'Grubišiæ', N'1234', N'A', 1)
GO
INSERT [dbo].[UserT] ([Id], [Username], [Name], [LastName], [Password], [Role], [IsActive]) VALUES (2, N'hleventic', N'Hrvoje', N'Leventiæ', N'123', N'A', 1)
GO
INSERT [dbo].[UserT] ([Id], [Username], [Name], [LastName], [Password], [Role], [IsActive]) VALUES (3, N'kpavlovic', N'Kristijan', N'Pavloviæ', N'123', N'D', 1)
GO
INSERT [dbo].[UserT] ([Id], [Username], [Name], [LastName], [Password], [Role], [IsActive]) VALUES (4, N'bjelic', N'Borna', N'Jeliæ', N'123', N'D', 1)
GO
INSERT [dbo].[UserT] ([Id], [Username], [Name], [LastName], [Password], [Role], [IsActive]) VALUES (5, N'iivic', N'Ivan', N'Iviæ', N'12345', N'A', 1)
GO
SET IDENTITY_INSERT [dbo].[UserT] OFF
GO
SET IDENTITY_INSERT [dbo].[GroupT] ON 

GO
INSERT [dbo].[GroupT] ([Id], [Name], [CourseId], [OwnerId]) VALUES (2, N'PR-LV3', 1, 5)
GO
INSERT [dbo].[GroupT] ([Id], [Name], [CourseId], [OwnerId]) VALUES (3, N'PR-LV2', 1, 1)
GO
INSERT [dbo].[GroupT] ([Id], [Name], [CourseId], [OwnerId]) VALUES (4, N'PR-LV1', 1, 2)
GO
SET IDENTITY_INSERT [dbo].[GroupT] OFF
GO
SET IDENTITY_INSERT [dbo].[CourseUserT] ON 

GO
INSERT [dbo].[CourseUserT] ([Id], [CourseId], [UserId]) VALUES (1, 1, 2)
GO
INSERT [dbo].[CourseUserT] ([Id], [CourseId], [UserId]) VALUES (6, 3, 4)
GO
INSERT [dbo].[CourseUserT] ([Id], [CourseId], [UserId]) VALUES (10, 1, 1)
GO
INSERT [dbo].[CourseUserT] ([Id], [CourseId], [UserId]) VALUES (11, 1, 5)
GO
INSERT [dbo].[CourseUserT] ([Id], [CourseId], [UserId]) VALUES (12, 3, 3)
GO
SET IDENTITY_INSERT [dbo].[CourseUserT] OFF
GO
