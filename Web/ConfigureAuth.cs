using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;

namespace Web
{
	public partial class Startup
	{
		public static string ScopeRead;
		public static string ScopeWrite;

		private void ConfigureAzureAd(IServiceCollection services)
		{
			var tenant = Configuration["AzureAd:Tenant"];
			var clientId = Configuration["AzureAd:ClientId"];
			var policy = Configuration["AzureAd:Policy"];

			services.AddAuthentication(o =>
			{
				o.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
				o.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
			})
			.AddJwtBearer(o =>
				{
					o.MetadataAddress = $"https://login.microsoftonline.com/{tenant}/v2.0/.well-known/openid-configuration?p={policy}";
					o.Audience = clientId;
					o.Events = new JwtBearerEvents
					{
						OnAuthenticationFailed = c =>
						{
							c.NoResult();

							c.Response.StatusCode = 500;
							c.Response.ContentType = "text/plain";
							if (HostingEnvironment.IsDevelopment())
							{
							// Debug only, in production do not share exceptions with the remote host.
							return c.Response.WriteAsync(c.Exception.ToString());
							}
							return c.Response.WriteAsync("An error occurred processing your authentication.");
						}
					};
				});
			ScopeRead = Configuration["Authentication:AzureAd:ScopeRead"];
			ScopeWrite = Configuration["Authentication:AzureAd:ScopeWrite"];
		}
	}
}
