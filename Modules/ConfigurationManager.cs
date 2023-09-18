namespace NETCoreBackend.Modules;

internal static class ConfigurationManager
{
    static ConfigurationManager()
    {
        AppSetting = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
            .Build();
    }

    public static IConfiguration AppSetting { get; }
}