using System.Data.SqlClient;
using ReactApp1.Server.Models;
using ReactApp1.Server.Dtos;
using Dapper;
using Microsoft.AspNetCore.Http.HttpResults;
namespace ReactApp1.Server.Services
{
    public class DepartmentService
    {
        string connectionString;

        public DepartmentService(IConfiguration configuration)
        {
            connectionString = configuration.GetConnectionString("DefaultConnection") ?? throw new ArgumentNullException("Connection string can not be null");
        }

        public async Task<IEnumerable<DepartmentModel>> getAll()
        {
            SqlConnection connection = new SqlConnection(connectionString);
            string query = "SELECT * FROM Departments";

            var deptInfo = await connection.QueryAsync<DepartmentModel>(query);
            return deptInfo;
        }

        public async Task<IEnumerable<User>> getAllUsersByDept(string Name)
        {
            SqlConnection connection = new SqlConnection(connectionString);
            string query = "SELECT Users.Id, Users.FirstName, Users.LastName, Users.Email, Users.DateJoined FROM Users INNER JOIN Departments ON Users.Id = Departments.Id WHERE Departments.Department = @name";

            var results = await connection.QueryAsync<User>(query, new {name = Name});

            return results;
        }

    }
}
