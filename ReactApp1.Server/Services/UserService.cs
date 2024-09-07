using Dapper;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using ReactApp1.Server.Models;
using System.ComponentModel.Design.Serialization;
using ReactApp1.Server.Dtos;

namespace ReactApp1.Server.Services
{
    public class UserService
    {
        public required string _connectionString { get; init; }

        public UserService(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")?? throw new ArgumentNullException(nameof(configuration), "Connection string cannot be null");
        }

        private SqlConnection CreateConnection()
        {
            return new SqlConnection(_connectionString);
        }

        public async Task<IEnumerable<User>> getUsers()
        {
            SqlConnection connection = CreateConnection();
            string query = "SELECT Id, FirstName, LastName, Email, CAST(DateJoined AS DATE) AS DateJoined From Users";

            var users =  await connection.QueryAsync<User>(query);
            return users;
        }

        public async Task<IEnumerable<User>> getUserById(int id)
        {
            SqlConnection connection = CreateConnection();
            string query = "Select * From Users WHERE Users.id = @id";

            var user = await connection.QueryAsync<User>(query, new {id = id} );
            return user;
        }

        public async Task<int> createUser(User user)
        {
            SqlConnection connection = CreateConnection();
            string create = "INSERT INTO Users (FirstName, LastName, Email, DateJoined) VALUES (@first, @last, @email, @date) SELECT Cast(Scope_Identity() as int)";

            int id = await connection.ExecuteScalarAsync<int>(create, new {first = user.FirstName, last = user.LastName, email = user.Email, date = user.DateJoined});
            return id;
        }

        public async Task createDept(DepartmentModel department)
        {
            SqlConnection connection = CreateConnection();
            string createDept = "INSERT INTO Departments (Department, Id) VALUES (@department, @id)";

            await connection.ExecuteScalarAsync(createDept, new {department = department.Department, id =  department.Id});
        }

        public async Task updateUser(User user, int id)
        {
            SqlConnection connection = CreateConnection();
            string update = "UPDATE Users SET Users.FirstName = @first, Users.LastName = @last, Users.Email = @email, Users.DateJoined = @date WHERE Users.Id = @id";

            await connection.ExecuteScalarAsync(update, new { first = user.FirstName, last = user.LastName, email = user.Email, date = user.DateJoined, id = id });
        }

        public async Task deleteUser(int id)
        {
            SqlConnection connection = CreateConnection();

            string delete = "DELETE FROM Users WHERE Users.Id = @id ";

            await connection.ExecuteScalarAsync(delete, new { id = id });
        }

        public async Task<IEnumerable<DepartmentModel>> getDepartment(int id)
        {
            SqlConnection connection = CreateConnection();
            string join = "SELECT Departments.Id, Departments.Department FROM Users LEFT JOIN Departments ON Users.Id = Departments.Id WHERE Users.Id = @id";

            var departmentInfo = await connection.QueryAsync<DepartmentModel>(join, new { id = id });
            return departmentInfo;
        }

        public async Task<IEnumerable<UserAndDepartmentModel>> getUsersWithDepartment()
        {
            SqlConnection connection = CreateConnection();
            string query = "SELECT Users.Id, Users.FirstName, Users.LastName, Users.Email, Users.DateJoined, STRING_AGG(Departments.Department, ', ') AS Department FROM Users LEFT JOIN Departments ON Users.Id = Departments.Id GROUP BY Users.Id, Users.FirstName, Users.LastName, Users.Email, Users.DateJoined";

            var results = await connection.QueryAsync<UserAndDepartmentModel>(query);
            return results;
        }



    }
}
