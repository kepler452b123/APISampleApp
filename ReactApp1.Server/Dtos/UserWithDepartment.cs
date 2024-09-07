using System.ComponentModel.DataAnnotations;

namespace ReactApp1.Server.Dtos
{
        public record class UserWithDepartment(int Id, [Required][StringLength(50)] string FirstName, [Required] string LastName, [Required] string Email, [Required] DateTime JoinDate, string Department)
        {

        }
}
