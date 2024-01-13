# build env
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env

WORKDIR /app

# copy all the necessary backend app files to the container
COPY ./Controllers ./Controllers
COPY ./Hubs ./Hubs
COPY ./Models ./Models
COPY ./Modules ./Modules
COPY ./Properties ./Properties
COPY ./Services ./Services
COPY ./appsettings.Development.json ./
COPY ./appsettings.json ./
COPY ./DawnLitWeb.csproj ./
COPY ./Program.cs ./

# Update Dotnet ef tool
RUN dotnet tool update --global dotnet-ef

# setup env
ENV PATH="$PATH:/root/.dotnet/tools"

# migrate the models
RUN dotnet ef migrations add TheMigration

# Sync the models with the database:
RUN dotnet ef database update

# Restore as distinct layers
RUN dotnet restore

# Build and publish a release
RUN dotnet publish -c Release -o out

# RUN dotnet tool install --global dotnet-ef
# ENV PATH="$PATH:/root/.dotnet/tools"
# RUN dotnet ef migrations add TheMigration
# RUN dotnet ef database update

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build-env /app/out .
ENTRYPOINT ["dotnet", "DawnLitWeb.dll"]