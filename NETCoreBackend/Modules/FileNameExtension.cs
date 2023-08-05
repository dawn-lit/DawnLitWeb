namespace NETCoreBackend.Modules;

public static class FileNameExtension
{
    public static string ObtainFileName(this IFormFile file, bool randomName = true)
    {
        string ext = file.FileName[file.FileName.LastIndexOf('.')..];

        string fileName = randomName ? Path.GetTempFileName() : file.FileName;

        int start = fileName.LastIndexOf('\\');

        if (start < 0)
        {
            start = 0;
        }

        int end = fileName.LastIndexOf('.');

        return $"{fileName.Substring(start, end - start)}{ext}".TrimStart('\\');
    }
}