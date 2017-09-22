USE [master]
GO
/****** Object:  Database [Demonstrature]    Script Date: 22.9.2017. 23:45:02 ******/
CREATE DATABASE [Demonstrature]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'Demonstrature', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL13.MSSQLSERVER\MSSQL\DATA\Demonstrature.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'Demonstrature_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL13.MSSQLSERVER\MSSQL\DATA\Demonstrature_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
GO
ALTER DATABASE [Demonstrature] SET COMPATIBILITY_LEVEL = 130
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [Demonstrature].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [Demonstrature] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [Demonstrature] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [Demonstrature] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [Demonstrature] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [Demonstrature] SET ARITHABORT OFF 
GO
ALTER DATABASE [Demonstrature] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [Demonstrature] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [Demonstrature] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [Demonstrature] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [Demonstrature] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [Demonstrature] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [Demonstrature] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [Demonstrature] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [Demonstrature] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [Demonstrature] SET  DISABLE_BROKER 
GO
ALTER DATABASE [Demonstrature] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [Demonstrature] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [Demonstrature] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [Demonstrature] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [Demonstrature] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [Demonstrature] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [Demonstrature] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [Demonstrature] SET RECOVERY FULL 
GO
ALTER DATABASE [Demonstrature] SET  MULTI_USER 
GO
ALTER DATABASE [Demonstrature] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [Demonstrature] SET DB_CHAINING OFF 
GO
ALTER DATABASE [Demonstrature] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [Demonstrature] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [Demonstrature] SET DELAYED_DURABILITY = DISABLED 
GO
EXEC sys.sp_db_vardecimal_storage_format N'Demonstrature', N'ON'
GO
ALTER DATABASE [Demonstrature] SET QUERY_STORE = OFF
GO
USE [Demonstrature]
GO
ALTER DATABASE SCOPED CONFIGURATION SET MAXDOP = 0;
GO
ALTER DATABASE SCOPED CONFIGURATION FOR SECONDARY SET MAXDOP = PRIMARY;
GO
ALTER DATABASE SCOPED CONFIGURATION SET LEGACY_CARDINALITY_ESTIMATION = OFF;
GO
ALTER DATABASE SCOPED CONFIGURATION FOR SECONDARY SET LEGACY_CARDINALITY_ESTIMATION = PRIMARY;
GO
ALTER DATABASE SCOPED CONFIGURATION SET PARAMETER_SNIFFING = ON;
GO
ALTER DATABASE SCOPED CONFIGURATION FOR SECONDARY SET PARAMETER_SNIFFING = PRIMARY;
GO
ALTER DATABASE SCOPED CONFIGURATION SET QUERY_OPTIMIZER_HOTFIXES = OFF;
GO
ALTER DATABASE SCOPED CONFIGURATION FOR SECONDARY SET QUERY_OPTIMIZER_HOTFIXES = PRIMARY;
GO
USE [Demonstrature]
GO
/****** Object:  Table [dbo].[CourseT]    Script Date: 22.9.2017. 23:45:02 ******/
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
/****** Object:  Table [dbo].[CourseUserT]    Script Date: 22.9.2017. 23:45:02 ******/
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
/****** Object:  Table [dbo].[GroupT]    Script Date: 22.9.2017. 23:45:02 ******/
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
/****** Object:  Table [dbo].[TermT]    Script Date: 22.9.2017. 23:45:02 ******/
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
	[SuggestedUserId] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[UserT]    Script Date: 22.9.2017. 23:45:02 ******/
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

INSERT [dbo].[CourseUserT] ([Id], [CourseId], [UserId]) VALUES (20, 2, 4)
INSERT [dbo].[CourseUserT] ([Id], [CourseId], [UserId]) VALUES (21, 1, 4)
INSERT [dbo].[CourseUserT] ([Id], [CourseId], [UserId]) VALUES (22, 3, 4)
INSERT [dbo].[CourseUserT] ([Id], [CourseId], [UserId]) VALUES (23, 2, 5)
INSERT [dbo].[CourseUserT] ([Id], [CourseId], [UserId]) VALUES (24, 3, 5)
INSERT [dbo].[CourseUserT] ([Id], [CourseId], [UserId]) VALUES (1013, 2, 1)
INSERT [dbo].[CourseUserT] ([Id], [CourseId], [UserId]) VALUES (1014, 1, 1)
INSERT [dbo].[CourseUserT] ([Id], [CourseId], [UserId]) VALUES (1015, 3, 1)
INSERT [dbo].[CourseUserT] ([Id], [CourseId], [UserId]) VALUES (1016, 4, 1)
INSERT [dbo].[CourseUserT] ([Id], [CourseId], [UserId]) VALUES (1017, 2, 2)
INSERT [dbo].[CourseUserT] ([Id], [CourseId], [UserId]) VALUES (1018, 1, 2)
INSERT [dbo].[CourseUserT] ([Id], [CourseId], [UserId]) VALUES (1019, 2, 3)
INSERT [dbo].[CourseUserT] ([Id], [CourseId], [UserId]) VALUES (1020, 3, 3)
SET IDENTITY_INSERT [dbo].[CourseUserT] OFF
SET IDENTITY_INSERT [dbo].[GroupT] ON 

INSERT [dbo].[GroupT] ([Id], [Name], [CourseId], [OwnerId]) VALUES (2, N'PR-LV3', 1, 1)
INSERT [dbo].[GroupT] ([Id], [Name], [CourseId], [OwnerId]) VALUES (3, N'PR-LV2', 1, 1)
INSERT [dbo].[GroupT] ([Id], [Name], [CourseId], [OwnerId]) VALUES (4, N'PR-LV1', 1, 1)
INSERT [dbo].[GroupT] ([Id], [Name], [CourseId], [OwnerId]) VALUES (5, N'PE-LV1', 2, 2)
INSERT [dbo].[GroupT] ([Id], [Name], [CourseId], [OwnerId]) VALUES (6, N'PE-LV2', 2, 3)
INSERT [dbo].[GroupT] ([Id], [Name], [CourseId], [OwnerId]) VALUES (7, N'PE-LV3', 2, 1)
INSERT [dbo].[GroupT] ([Id], [Name], [CourseId], [OwnerId]) VALUES (1005, N'grupa1', 4, NULL)
INSERT [dbo].[GroupT] ([Id], [Name], [CourseId], [OwnerId]) VALUES (1006, N'grupa2', 4, NULL)
INSERT [dbo].[GroupT] ([Id], [Name], [CourseId], [OwnerId]) VALUES (1007, N'grupa3', 4, NULL)
INSERT [dbo].[GroupT] ([Id], [Name], [CourseId], [OwnerId]) VALUES (1009, N'PE-LV4', 2, NULL)
INSERT [dbo].[GroupT] ([Id], [Name], [CourseId], [OwnerId]) VALUES (1010, N'PE-LV5', 2, NULL)
INSERT [dbo].[GroupT] ([Id], [Name], [CourseId], [OwnerId]) VALUES (1011, N'PE-LV6', 2, NULL)
SET IDENTITY_INSERT [dbo].[GroupT] OFF
SET IDENTITY_INSERT [dbo].[TermT] ON 

INSERT [dbo].[TermT] ([Id], [CourseId], [UserId], [GroupId], [TermDate], [SuggestedUserId]) VALUES (2142, 2, NULL, 5, CAST(N'2017-09-24' AS Date), 0)
INSERT [dbo].[TermT] ([Id], [CourseId], [UserId], [GroupId], [TermDate], [SuggestedUserId]) VALUES (2143, 2, NULL, 6, CAST(N'2017-09-24' AS Date), 0)
INSERT [dbo].[TermT] ([Id], [CourseId], [UserId], [GroupId], [TermDate], [SuggestedUserId]) VALUES (2144, 2, 1, 7, CAST(N'2017-09-24' AS Date), 0)
INSERT [dbo].[TermT] ([Id], [CourseId], [UserId], [GroupId], [TermDate], [SuggestedUserId]) VALUES (2145, 2, NULL, 1009, CAST(N'2017-09-24' AS Date), 0)
INSERT [dbo].[TermT] ([Id], [CourseId], [UserId], [GroupId], [TermDate], [SuggestedUserId]) VALUES (2146, 2, NULL, 1010, CAST(N'2017-09-24' AS Date), 0)
INSERT [dbo].[TermT] ([Id], [CourseId], [UserId], [GroupId], [TermDate], [SuggestedUserId]) VALUES (2147, 2, 2, 1011, CAST(N'2017-09-24' AS Date), 0)
INSERT [dbo].[TermT] ([Id], [CourseId], [UserId], [GroupId], [TermDate], [SuggestedUserId]) VALUES (2154, 2, 2, 5, CAST(N'2017-09-26' AS Date), 0)
INSERT [dbo].[TermT] ([Id], [CourseId], [UserId], [GroupId], [TermDate], [SuggestedUserId]) VALUES (2155, 2, 3, 6, CAST(N'2017-09-26' AS Date), 0)
INSERT [dbo].[TermT] ([Id], [CourseId], [UserId], [GroupId], [TermDate], [SuggestedUserId]) VALUES (2156, 2, 1, 7, CAST(N'2017-09-26' AS Date), 0)
INSERT [dbo].[TermT] ([Id], [CourseId], [UserId], [GroupId], [TermDate], [SuggestedUserId]) VALUES (2157, 2, NULL, 1009, CAST(N'2017-09-26' AS Date), 0)
INSERT [dbo].[TermT] ([Id], [CourseId], [UserId], [GroupId], [TermDate], [SuggestedUserId]) VALUES (2158, 2, 1, 1010, CAST(N'2017-09-26' AS Date), 0)
INSERT [dbo].[TermT] ([Id], [CourseId], [UserId], [GroupId], [TermDate], [SuggestedUserId]) VALUES (2159, 2, NULL, 1011, CAST(N'2017-09-26' AS Date), 0)
INSERT [dbo].[TermT] ([Id], [CourseId], [UserId], [GroupId], [TermDate], [SuggestedUserId]) VALUES (2160, 2, 2, 5, CAST(N'2017-09-27' AS Date), 0)
INSERT [dbo].[TermT] ([Id], [CourseId], [UserId], [GroupId], [TermDate], [SuggestedUserId]) VALUES (2161, 2, 2, 6, CAST(N'2017-09-27' AS Date), 0)
INSERT [dbo].[TermT] ([Id], [CourseId], [UserId], [GroupId], [TermDate], [SuggestedUserId]) VALUES (2162, 2, 1, 7, CAST(N'2017-09-27' AS Date), 0)
INSERT [dbo].[TermT] ([Id], [CourseId], [UserId], [GroupId], [TermDate], [SuggestedUserId]) VALUES (2163, 2, NULL, 1009, CAST(N'2017-09-27' AS Date), 0)
INSERT [dbo].[TermT] ([Id], [CourseId], [UserId], [GroupId], [TermDate], [SuggestedUserId]) VALUES (2164, 2, 2, 1010, CAST(N'2017-09-27' AS Date), 0)
INSERT [dbo].[TermT] ([Id], [CourseId], [UserId], [GroupId], [TermDate], [SuggestedUserId]) VALUES (2165, 2, NULL, 1011, CAST(N'2017-09-27' AS Date), 0)
INSERT [dbo].[TermT] ([Id], [CourseId], [UserId], [GroupId], [TermDate], [SuggestedUserId]) VALUES (2166, 2, 2, 5, CAST(N'2017-09-28' AS Date), 0)
INSERT [dbo].[TermT] ([Id], [CourseId], [UserId], [GroupId], [TermDate], [SuggestedUserId]) VALUES (2167, 2, NULL, 6, CAST(N'2017-09-28' AS Date), 0)
INSERT [dbo].[TermT] ([Id], [CourseId], [UserId], [GroupId], [TermDate], [SuggestedUserId]) VALUES (2168, 2, 1, 7, CAST(N'2017-09-28' AS Date), 0)
INSERT [dbo].[TermT] ([Id], [CourseId], [UserId], [GroupId], [TermDate], [SuggestedUserId]) VALUES (2169, 2, NULL, 1009, CAST(N'2017-09-28' AS Date), 0)
INSERT [dbo].[TermT] ([Id], [CourseId], [UserId], [GroupId], [TermDate], [SuggestedUserId]) VALUES (2170, 2, NULL, 1010, CAST(N'2017-09-28' AS Date), 0)
INSERT [dbo].[TermT] ([Id], [CourseId], [UserId], [GroupId], [TermDate], [SuggestedUserId]) VALUES (2171, 2, 1, 1011, CAST(N'2017-09-28' AS Date), 0)
INSERT [dbo].[TermT] ([Id], [CourseId], [UserId], [GroupId], [TermDate], [SuggestedUserId]) VALUES (2172, 2, NULL, 5, CAST(N'2017-09-29' AS Date), 0)
INSERT [dbo].[TermT] ([Id], [CourseId], [UserId], [GroupId], [TermDate], [SuggestedUserId]) VALUES (2173, 2, 3, 6, CAST(N'2017-09-29' AS Date), 0)
INSERT [dbo].[TermT] ([Id], [CourseId], [UserId], [GroupId], [TermDate], [SuggestedUserId]) VALUES (2174, 2, NULL, 7, CAST(N'2017-09-29' AS Date), 0)
INSERT [dbo].[TermT] ([Id], [CourseId], [UserId], [GroupId], [TermDate], [SuggestedUserId]) VALUES (2175, 2, NULL, 1009, CAST(N'2017-09-29' AS Date), 0)
INSERT [dbo].[TermT] ([Id], [CourseId], [UserId], [GroupId], [TermDate], [SuggestedUserId]) VALUES (2176, 2, 3, 1010, CAST(N'2017-09-29' AS Date), 0)
INSERT [dbo].[TermT] ([Id], [CourseId], [UserId], [GroupId], [TermDate], [SuggestedUserId]) VALUES (2177, 2, NULL, 1011, CAST(N'2017-09-29' AS Date), 0)
INSERT [dbo].[TermT] ([Id], [CourseId], [UserId], [GroupId], [TermDate], [SuggestedUserId]) VALUES (2178, 2, NULL, 5, CAST(N'2017-09-21' AS Date), 0)
INSERT [dbo].[TermT] ([Id], [CourseId], [UserId], [GroupId], [TermDate], [SuggestedUserId]) VALUES (2179, 2, NULL, 6, CAST(N'2017-09-21' AS Date), 0)
INSERT [dbo].[TermT] ([Id], [CourseId], [UserId], [GroupId], [TermDate], [SuggestedUserId]) VALUES (2180, 2, NULL, 7, CAST(N'2017-09-21' AS Date), 0)
INSERT [dbo].[TermT] ([Id], [CourseId], [UserId], [GroupId], [TermDate], [SuggestedUserId]) VALUES (2181, 2, NULL, 1009, CAST(N'2017-09-21' AS Date), 0)
INSERT [dbo].[TermT] ([Id], [CourseId], [UserId], [GroupId], [TermDate], [SuggestedUserId]) VALUES (2182, 2, NULL, 1010, CAST(N'2017-09-21' AS Date), 0)
INSERT [dbo].[TermT] ([Id], [CourseId], [UserId], [GroupId], [TermDate], [SuggestedUserId]) VALUES (2183, 2, NULL, 1011, CAST(N'2017-09-21' AS Date), 0)
INSERT [dbo].[TermT] ([Id], [CourseId], [UserId], [GroupId], [TermDate], [SuggestedUserId]) VALUES (2185, 2, NULL, 7, CAST(N'2017-09-25' AS Date), 0)
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
USE [master]
GO
ALTER DATABASE [Demonstrature] SET  READ_WRITE 
GO
