# build env
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build-env

WORKDIR /App

# Copy everything
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

# Restore as distinct layers
RUN dotnet restore
# Build and publish a release
RUN dotnet publish -c Release -o out

#RUN dotnet tool install --global dotnet-ef
#ENV PATH="$PATH:/root/.dotnet/tools"
#RUN dotnet ef migrations add TheMigration
#RUN dotnet ef database update

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /App
COPY --from=build-env /App/out .
ENTRYPOINT ["dotnet", "DawnLitWeb.dll"]