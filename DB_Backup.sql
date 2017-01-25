USE [Demonstrature]
GO
/****** Object:  Table [dbo].[CourseT]    Script Date: 25.1.2017. 19:10:05 ******/
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
/****** Object:  Table [dbo].[CourseUserT]    Script Date: 25.1.2017. 19:10:05 ******/
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
/****** Object:  Table [dbo].[GroupT]    Script Date: 25.1.2017. 19:10:05 ******/
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
/****** Object:  Table [dbo].[TermT]    Script Date: 25.1.2017. 19:10:05 ******/
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
/****** Object:  Table [dbo].[UserT]    Script Date: 25.1.2017. 19:10:05 ******/
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
