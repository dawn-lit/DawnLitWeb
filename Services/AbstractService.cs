﻿using System.Linq.Expressions;
using DawnLitWeb.Models;
using DawnLitWeb.Modules;
using Microsoft.EntityFrameworkCore;

namespace DawnLitWeb.Services;

public abstract class AbstractService<T>(DatabaseContext db, DbSet<T> collection)
    where T : AbstractModel
{
    protected DatabaseContext GetDatabaseContext()
    {
        return db;
    }

    protected DbSet<T> GetDatabaseCollection()
    {
        return collection;
    }

    public async Task<long> CountAsync(Expression<Func<T, bool>> predicate)
    {
        return await this.GetDatabaseCollection().LongCountAsync(predicate);
    }

    public async Task<long> CountAsync()
    {
        return await this.GetDatabaseCollection().LongCountAsync();
    }

    public async Task<bool> CreateAsync(T newData)
    {
        this.GetDatabaseCollection().Add(newData);
        await this.SaveChangesAsync();
        return true;
    }

    public async Task<T?> GetAsync(int id)
    {
        return await this.GetDatabaseCollection().FirstOrDefaultAsync(x => x.Id == id);
    }

    protected async Task<T?> GetByExpressionAsync(Expression<Func<T, bool>> predicate)
    {
        return await this.GetDatabaseCollection().FirstOrDefaultAsync(predicate);
    }

    public async Task<List<T>> GetAsync()
    {
        return await this.GetDatabaseCollection().ToListAsync();
    }

    public async Task<bool> RemoveAsync(int id)
    {
        T? model = await this.GetAsync(id);
        if (model == null)
        {
            return false;
        }

        return await this.RemoveAsync(model);
    }

    public async Task<bool> RemoveAsync(T model)
    {
        this.GetDatabaseCollection().Remove(model);
        await this.SaveChangesAsync();

        return true;
    }

    public async Task SaveChangesAsync()
    {
        await this.GetDatabaseContext().SaveChangesAsync();
    }
}