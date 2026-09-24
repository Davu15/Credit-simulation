var builder = WebApplication.CreateBuilder(args);

// 1. Configurar política de CORS para permitir a React
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

var app = builder.Build();

// 2. Activar CORS antes del proxy
app.UseCors("AllowFrontend");

app.MapReverseProxy();

app.Run();