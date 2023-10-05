using DawnLitWeb.Models;
using DawnLitWeb.Modules;
using DawnLitWeb.Services;
using Microsoft.AspNetCore.Mvc;

namespace DawnLitWeb.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FilesController : AbstractUserController
{
    private const string FILE_DIRECTORY = "Files";
    private readonly FilesService _filesService;
    private readonly UsersService _usersService;

    public FilesController(DatabaseContext db)
    {
        this._filesService = new FilesService(db);
        this._usersService = new UsersService(db);
        // make sure folder is created
        Directory.CreateDirectory(FILE_DIRECTORY);
    }

    [HttpPost("new/single/{fileType}")]
    public async Task<IActionResult> PostSingle(string fileType)
    {
        // if nothing
        if (this.Request.Form.Files.Count == 0)
        {
            return this.NoContent();
        }

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

        IFormFile file = this.Request.Form.Files[0];

        //get uploaded file name
        string ext = file.FileName[file.FileName.LastIndexOf('.')..];
        string fileName = $"{fileType}_{currentUserId}{ext}";

        // create a file record
        FileItem newFileRecord = new()
        {
            Creator = creator,
            Type = fileType,
            Name = fileName,
            Path = $"{FILE_DIRECTORY}/{fileName}",
            Size = 0
        };

        // save file to folder
        await using FileStream stream = new(newFileRecord.Path, FileMode.Create);
        await file.CopyToAsync(stream);

        // save the record
        await this._filesService.CreateAsync(newFileRecord);

        return this.Accepted();
    }

    [HttpGet("get/single/{userId:int}/{fileType}")]
    public async Task<ActionResult<string>> GetSingle(int userId, string fileType)
    {
        FileItem? theFile = await this._filesService.GetAsync(userId, fileType);
        if (theFile == null)
        {
            return this.Ok(new { src = "" });
        }

        byte[] bytes = await System.IO.File.ReadAllBytesAsync(theFile.Path);
        return this.Ok(new { src = Convert.ToBase64String(bytes) });
    }
}