--INSERT INTO CourseUserT (CourseId, UserId) VALUES (1,1);
--ALTER TABLE TermT ALTER COLUMN UserId varchar(100) NULL
--INSERT INTO TermT ("CourseId","UserId","GroupId","TermDate") VALUES ('1',null,'2','11-10-2016')
--INSERT INTO GroupT ("Name","CourseId","OwnerId") VALUES ('aaa',2,null)
--DELETE FROM TermT WHERE Id>0
--DELETE FROM GroupT WHERE Id>8

SELECT TOP 1000 [Id],[Name],[Study],[Professor],[Asistant],[IsActive]FROM [Demonstrature].[dbo].[CourseT]
SELECT TOP 1000 [Id],[Username],[Name],[LastName],[Password],[Salt],[Role],[IsActive]FROM [Demonstrature].[dbo].[UserT]
SELECT TOP 1000 [Id],[CourseId],[UserId],[GroupId],[TermDate],[SuggestedUserId] FROM [Demonstrature].[dbo].[TermT]
SELECT TOP 1000 [Id],[Name],[CourseId],[OwnerId]FROM [Demonstrature].[dbo].[GroupT]
SELECT TOP 1000 [Id],[CourseId],[UserId]FROM [Demonstrature].[dbo].[CourseUserT]