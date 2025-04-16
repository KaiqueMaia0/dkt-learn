FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["dkt-learn-back/DKT-Learn/DKT-Learn.csproj", "dkt-learn-back/DKT-Learn/"]
RUN dotnet restore "dkt-learn-back/DKT-Learn/DKT-Learn.csproj"
COPY . .
WORKDIR "/src/dkt-learn-back/DKT-Learn"
RUN dotnet build "DKT-Learn.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "DKT-Learn.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "DKT-Learn.dll"]
