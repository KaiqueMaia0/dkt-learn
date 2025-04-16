FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["dkt-learn-back/dkt-learn-back.csproj", "dkt-learn-back/"]
RUN dotnet restore "dkt-learn-back/dkt-learn-back.csproj"
COPY . .
WORKDIR "/src/dkt-learn-back"
RUN dotnet build "dkt-learn-back.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "dkt-learn-back.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "dkt-learn-back.dll"]
