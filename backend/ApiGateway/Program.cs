var builder = WebApplication.CreateBuilder(args);

// Agrega el servicio de YARP y lee la configuración del appsettings.json
builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

var app = builder.Build();

// Mapea el enrutador para que intercepte las peticiones
app.MapReverseProxy();

app.Run();