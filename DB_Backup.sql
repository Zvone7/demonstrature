USE [Demonstrature]
GO
/****** Object:  Table [dbo].[CourseT]    Script Date: 12.4.2017. 13:18:00 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CourseT](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](100) NOT NULL,
	[Study] [varchar](100) NOT NULL,
	[Professor] [varchar](100) NOT NULL,
	[Asistant] [varchar](100) NOT NULL,
	[IsActive] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[CourseUserT]    Script Date: 12.4.2017. 13:18:00 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CourseUserT](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[CourseId] [int] NOT NULL,
	[UserId] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[GroupT]    Script Date: 12.4.2017. 13:18:00 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[GroupT](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](100) NOT NULL,
	[CourseId] [int] NOT NULL,
	[OwnerId] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[TermT]    Script Date: 12.4.2017. 13:18:00 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TermT](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[CourseId] [int] NOT NULL,
	[UserId] [int] NULL,
	[GroupId] [int] NOT NULL,
	[TermDate] [date] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[UserT]    Script Date: 12.4.2017. 13:18:00 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserT](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Username] [varchar](50) NOT NULL,
	[Name] [varchar](100) NOT NULL,
	[LastName] [varchar](100) NOT NULL,
	[Password] [varchar](100) NOT NULL,
	[Role] [varchar](100) NOT NULL,
	[IsActive] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET IDENTITY_INSERT [dbo].[CourseT] ON 

INSERT [dbo].[CourseT] ([Id], [Name], [Study], [Professor], [Asistant], [IsActive]) VALUES (1, N'Programiranje 1', N'Računarstvo', N'Martinović', N'Leventić', 1)
INSERT [dbo].[CourseT] ([Id], [Name], [Study], [Professor], [Asistant], [IsActive]) VALUES (2, N'Fizika 1', N'Elektrotehnika', N'Martinović', N'Leventić', 1)
INSERT [dbo].[CourseT] ([Id], [Name], [Study], [Professor], [Asistant], [IsActive]) VALUES (3, N'Programiranje 2', N'Računarstvo', N'Martinović', N'Leventić', 1)
INSERT [dbo].[CourseT] ([Id], [Name], [Study], [Professor], [Asistant], [IsActive]) VALUES (4, N'Programiranje 2', N'Elektrotehnika', N'Martinović', N'Leventić', 1)
SET IDENTITY_INSERT [dbo].[CourseT] OFF
SET IDENTITY_INSERT [dbo].[CourseUserT] ON 

INSERT [dbo].[CourseUserT] ([Id], [CourseId], [UserId]) VALUES (1, 1, 2)
INSERT [dbo].[CourseUserT] ([Id], [CourseId], [UserId]) VALUES (12, 3, 3)
INSERT [dbo].[CourseUserT] ([Id], [CourseId], [UserId]) VALUES (20, 2, 4)
INSERT [dbo].[CourseUserT] ([Id], [CourseId], [UserId]) VALUES (21, 1, 4)
INSERT [dbo].[CourseUserT] ([Id], [CourseId], [UserId]) VALUES (22, 3, 4)
INSERT [dbo].[CourseUserT] ([Id], [CourseId], [UserId]) VALUES (23, 2, 5)
INSERT [dbo].[CourseUserT] ([Id], [CourseId], [UserId]) VALUES (24, 3, 5)
INSERT [dbo].[CourseUserT] ([Id], [CourseId], [UserId]) VALUES (25, 1, 1)
INSERT [dbo].[CourseUserT] ([Id], [CourseId], [UserId]) VALUES (26, 3, 1)
INSERT [dbo].[CourseUserT] ([Id], [CourseId], [UserId]) VALUES (27, 4, 1)
SET IDENTITY_INSERT [dbo].[CourseUserT] OFF
SET IDENTITY_INSERT [dbo].[GroupT] ON 

INSERT [dbo].[GroupT] ([Id], [Name], [CourseId], [OwnerId]) VALUES (2, N'PR-LV3', 1, 5)
INSERT [dbo].[GroupT] ([Id], [Name], [CourseId], [OwnerId]) VALUES (3, N'PR-LV2', 1, 1)
INSERT [dbo].[GroupT] ([Id], [Name], [CourseId], [OwnerId]) VALUES (4, N'PR-LV1', 1, 2)
INSERT [dbo].[GroupT] ([Id], [Name], [CourseId], [OwnerId]) VALUES (5, N'PE-LV1', 2, 5)
INSERT [dbo].[GroupT] ([Id], [Name], [CourseId], [OwnerId]) VALUES (6, N'PE-LV2', 2, 5)
INSERT [dbo].[GroupT] ([Id], [Name], [CourseId], [OwnerId]) VALUES (7, N'PE-LV3', 2, 4)
SET IDENTITY_INSERT [dbo].[GroupT] OFF
SET IDENTITY_INSERT [dbo].[TermT] ON 

INSERT [dbo].[TermT] ([Id], [CourseId], [UserId], [GroupId], [TermDate]) VALUES (1, 2, NULL, 5, CAST(N'2017-03-17' AS Date))
INSERT [dbo].[TermT] ([Id], [CourseId], [UserId], [GroupId], [TermDate]) VALUES (2, 2, NULL, 6, CAST(N'2017-03-17' AS Date))
INSERT [dbo].[TermT] ([Id], [CourseId], [UserId], [GroupId], [TermDate]) VALUES (3, 2, NULL, 7, CAST(N'2017-03-17' AS Date))
INSERT [dbo].[TermT] ([Id], [CourseId], [UserId], [GroupId], [TermDate]) VALUES (1002, 2, NULL, 5, CAST(N'2017-04-12' AS Date))
INSERT [dbo].[TermT] ([Id], [CourseId], [UserId], [GroupId], [TermDate]) VALUES (1003, 2, NULL, 6, CAST(N'2017-04-12' AS Date))
INSERT [dbo].[TermT] ([Id], [CourseId], [UserId], [GroupId], [TermDate]) VALUES (1004, 2, NULL, 7, CAST(N'2017-04-12' AS Date))
INSERT [dbo].[TermT] ([Id], [CourseId], [UserId], [GroupId], [TermDate]) VALUES (1005, 2, NULL, 5, CAST(N'2017-04-11' AS Date))
INSERT [dbo].[TermT] ([Id], [CourseId], [UserId], [GroupId], [TermDate]) VALUES (1006, 2, NULL, 6, CAST(N'2017-04-11' AS Date))
INSERT [dbo].[TermT] ([Id], [CourseId], [UserId], [GroupId], [TermDate]) VALUES (1007, 2, NULL, 7, CAST(N'2017-04-11' AS Date))
INSERT [dbo].[TermT] ([Id], [CourseId], [UserId], [GroupId], [TermDate]) VALUES (1008, 2, NULL, 5, CAST(N'2017-04-10' AS Date))
INSERT [dbo].[TermT] ([Id], [CourseId], [UserId], [GroupId], [TermDate]) VALUES (1009, 2, NULL, 6, CAST(N'2017-04-10' AS Date))
INSERT [dbo].[TermT] ([Id], [CourseId], [UserId], [GroupId], [TermDate]) VALUES (1010, 2, NULL, 7, CAST(N'2017-04-10' AS Date))
SET IDENTITY_INSERT [dbo].[TermT] OFF
SET IDENTITY_INSERT [dbo].[UserT] ON 

INSERT [dbo].[UserT] ([Id], [Username], [Name], [LastName], [Password], [Role], [IsActive]) VALUES (1, N'zgrubisic', N'Zvonimir', N'Grubišić', N'1234', N'A', 1)
INSERT [dbo].[UserT] ([Id], [Username], [Name], [LastName], [Password], [Role], [IsActive]) VALUES (2, N'hleventic', N'Hrvoje', N'Leventić', N'123', N'A', 1)
INSERT [dbo].[UserT] ([Id], [Username], [Name], [LastName], [Password], [Role], [IsActive]) VALUES (3, N'kpavlovic', N'Kristijan', N'Pavlović', N'123', N'D', 1)
INSERT [dbo].[UserT] ([Id], [Username], [Name], [LastName], [Password], [Role], [IsActive]) VALUES (4, N'bjelic', N'Borna', N'Jelić', N'123', N'D', 1)
INSERT [dbo].[UserT] ([Id], [Username], [Name], [LastName], [Password], [Role], [IsActive]) VALUES (5, N'iivic', N'Ivan', N'Ivić', N'12345', N'D', 1)
SET IDENTITY_INSERT [dbo].[UserT] OFF
ALTER TABLE [dbo].[CourseUserT]  WITH CHECK ADD  CONSTRAINT [FkCourseUserCourse] FOREIGN KEY([CourseId])
REFERENCES [dbo].[CourseT] ([Id])
ON UPDATE CASCADE
GO
ALTER TABLE [dbo].[CourseUserT] CHECK CONSTRAINT [FkCourseUserCourse]
GO
ALTER TABLE [dbo].[CourseUserT]  WITH CHECK ADD  CONSTRAINT [FkCourseUserUser] FOREIGN KEY([UserId])
REFERENCES [dbo].[UserT] ([Id])
ON UPDATE CASCADE
GO
ALTER TABLE [dbo].[CourseUserT] CHECK CONSTRAINT [FkCourseUserUser]
GO
ALTER TABLE [dbo].[GroupT]  WITH CHECK ADD  CONSTRAINT [FkGroupCourse] FOREIGN KEY([CourseId])
REFERENCES [dbo].[CourseT] ([Id])
ON UPDATE CASCADE
GO
ALTER TABLE [dbo].[GroupT] CHECK CONSTRAINT [FkGroupCourse]
GO
ALTER TABLE [dbo].[GroupT]  WITH CHECK ADD  CONSTRAINT [FkGroupOwner] FOREIGN KEY([OwnerId])
REFERENCES [dbo].[UserT] ([Id])
ON UPDATE CASCADE
GO
ALTER TABLE [dbo].[GroupT] CHECK CONSTRAINT [FkGroupOwner]
GO
ALTER TABLE [dbo].[TermT]  WITH CHECK ADD  CONSTRAINT [FkTermCourse] FOREIGN KEY([CourseId])
REFERENCES [dbo].[CourseT] ([Id])
ON UPDATE CASCADE
GO
ALTER TABLE [dbo].[TermT] CHECK CONSTRAINT [FkTermCourse]
GO
ALTER TABLE [dbo].[TermT]  WITH CHECK ADD  CONSTRAINT [FkTermGroup] FOREIGN KEY([GroupId])
REFERENCES [dbo].[GroupT] ([Id])
GO
ALTER TABLE [dbo].[TermT] CHECK CONSTRAINT [FkTermGroup]
GO
ALTER TABLE [dbo].[TermT]  WITH CHECK ADD  CONSTRAINT [FkTermUser] FOREIGN KEY([UserId])
REFERENCES [dbo].[UserT] ([Id])
GO
ALTER TABLE [dbo].[TermT] CHECK CONSTRAINT [FkTermUser]
GO
