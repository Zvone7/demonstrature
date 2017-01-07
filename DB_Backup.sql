USE [Demonstrature]
GO
/****** Object:  Table [dbo].[CourseT]    Script Date: 18.11.2016. 16:21:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CourseT](
	[Id] [int] NOT NULL,
	[Name] [varchar](100) NOT NULL,
	[Leader] [varchar](100) NOT NULL,
	[Asistant] [varchar](100) NOT NULL,
	[IsActive] [bit] NOT NULL,
 CONSTRAINT [PK_CourseT] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[GroupT]    Script Date: 18.11.2016. 16:21:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[GroupT](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](100) NOT NULL,
	[Owner] [varchar](100) NOT NULL,
 CONSTRAINT [PK_GroupT] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[TermT]    Script Date: 18.11.2016. 16:21:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TermT](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[CourseId] [int] NOT NULL,
	[UserId] [int] NOT NULL,
	[GroupId] [int] NOT NULL,
	[Date] [date] NOT NULL,
	[IsAvailable] [bit] NOT NULL,
 CONSTRAINT [PK_TermT] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[UserT]    Script Date: 18.11.2016. 16:21:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserT](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Username] [varchar](50) NOT NULL,
	[FullName] [varchar](100) NOT NULL,
	[Password] [varchar](100) NOT NULL,
	[Role] [varchar](100) NOT NULL,
	[IsActive] [bit] NOT NULL,
 CONSTRAINT [PK_UserT] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET IDENTITY_INSERT [dbo].[UserT] ON 

INSERT [dbo].[UserT] ([Id], [Username], [FullName], [Password], [Role], [IsActive]) VALUES (1, N'zgrubisic', N'Zvonimir Grubišić', N'123', N'A', 1)
INSERT [dbo].[UserT] ([Id], [Username], [FullName], [Password], [Role], [IsActive]) VALUES (2, N'hleventic', N'Hrvoje Leventić', N'123', N'A', 1)
INSERT [dbo].[UserT] ([Id], [Username], [FullName], [Password], [Role], [IsActive]) VALUES (3, N'kpavlovic', N'Kristijan Pavlović', N'123', N'DM', 1)
INSERT [dbo].[UserT] ([Id], [Username], [FullName], [Password], [Role], [IsActive]) VALUES (4, N'bjelic', N'Borna Jelić', N'123', N'D', 1)
SET IDENTITY_INSERT [dbo].[UserT] OFF
ALTER TABLE [dbo].[TermT]  WITH CHECK ADD  CONSTRAINT [FK_TermT_CourseT] FOREIGN KEY([CourseId])
REFERENCES [dbo].[CourseT] ([Id])
GO
ALTER TABLE [dbo].[TermT] CHECK CONSTRAINT [FK_TermT_CourseT]
GO
ALTER TABLE [dbo].[TermT]  WITH CHECK ADD  CONSTRAINT [FK_TermT_Usert] FOREIGN KEY([UserId])
REFERENCES [dbo].[UserT] ([Id])
GO
ALTER TABLE [dbo].[TermT] CHECK CONSTRAINT [FK_TermT_Usert]
GO
