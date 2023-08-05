using System.Net;
using Microsoft.AspNetCore.Mvc;
using NETCoreBackend.Models;
using NETCoreBackend.Modules;
using NETCoreBackend.Services;

namespace NETCoreBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FilesController : AbstractUserController
{
    private const string FILE_DIRECTORY = "Uploads";
    private readonly FilesService _filesService;
    private readonly UsersService _usersService;

    public FilesController(DatabaseContext db)
    {
        this._filesService = new FilesService(db);
        this._usersService = new UsersService(db);
        // make sure folder is created
        Directory.CreateDirectory(FILE_DIRECTORY);
    }

    [HttpPost("new")]
    public async Task<IActionResult> OnPostAsync()
    {
        // try get current user id
        int currentUserId = this.GetCurrentUserId();

        if (currentUserId <= 0)
        {
            return this.Conflict("user id");
        }

        // try get current user reference
        User? creator = await this._usersService.GetAsync(currentUserId);

        if (creator is null)
        {
            return this.Conflict("user null");
        }

        foreach (IFormFile file in this.Request.Form.Files)
        {
            //get uploaded file name
            string fileName = file.ObtainFileName();

            if (file.Length <= 0)
            {
                continue;
            }

            string filePath = $"{FILE_DIRECTORY}/{fileName}";

            // save file to folder
            await using FileStream stream = new(filePath, FileMode.Create);
            await file.CopyToAsync(stream);

            // create a file record
            FileItem newFileRecord = new()
            {
                Creator = creator,
                Name = fileName,
                Path = filePath,
                Size = 0
            };

            // save the record
            await this._filesService.CreateAsync(newFileRecord);
        }

        return this.Accepted();
    }

    [HttpPost("get")]
    public JsonResult OnGetListFolderContents()
    {
        string folderPath = "Upload";

        if (!Directory.Exists(folderPath))
        {
            return new JsonResult("Folder not exists!") { StatusCode = (int)HttpStatusCode.NotFound };
        }

        string[] folderItems = Directory.GetFiles(folderPath);

        if (folderItems.Length == 0)
        {
            return new JsonResult("Folder is empty!") { StatusCode = (int)HttpStatusCode.NoContent };
        }

        List<FileItem> galleryItems = folderItems.Select(file => new FileInfo(file)).Select(fileInfo => new FileItem
            {
                Name = fileInfo.Name, Path = $"https://localhost:7061/upload/{fileInfo.Name}", Size = fileInfo.Length
            })
            .ToList();

        return new JsonResult(galleryItems) { StatusCode = 200 };
    }
}