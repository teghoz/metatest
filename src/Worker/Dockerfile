FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-alpine AS base
WORKDIR /app
EXPOSE 89

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-alpine AS build
ARG BUILDMODE
WORKDIR /build
COPY . .
RUN dotnet restore
WORKDIR /build/src/Worker
RUN dotnet build --no-restore -c ${BUILDMODE}

FROM build AS publish
ARG BUILDMODE
RUN dotnet publish --no-build -c ${BUILDMODE} -o /app

FROM base AS final
WORKDIR /app
RUN ls -lah
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "Worker.dll"]
