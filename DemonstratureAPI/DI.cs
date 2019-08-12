using AutoMapper;
using DemonstratureBLL;
using DemonstratureBLL.Mappings;
using DemonstratureDB;
using StructureMap;

namespace DemonstratureAPI
{
    public static class DI
    {
        private static Container container;

        public static T GetInstance<T>()
        {
            return container.GetInstance<T>();
        }

        public static void Init()
        {
            var logger = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

            AutoMapperConfiguration.RegisterMappings();

            container = new Container(x =>
              {
                  x.For<log4net.ILog>().Singleton().Use(logger);
                  x.For<IMapper>().Singleton().Use(AutoMapperConfiguration.Instance);

                  x.For<UserRepo>().Singleton().Use<UserRepo>();
                  x.For<TermRepo>().Singleton().Use<TermRepo>();
                  x.For<GroupRepo>().Singleton().Use<GroupRepo>();
                  x.For<CourseRepo>().Singleton().Use<CourseRepo>();
                  x.For<CourseUserRepo>().Singleton().Use<CourseUserRepo>();

                  x.For<UserLogic>().Singleton().Use<UserLogic>();
                  x.For<TermLogic>().Singleton().Use<TermLogic>();
                  x.For<GroupLogic>().Singleton().Use<GroupLogic>();
                  x.For<CourseLogic>().Singleton().Use<CourseLogic>();
              });

            container.AssertConfigurationIsValid();
        }
    }
}