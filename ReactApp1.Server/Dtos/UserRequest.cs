using System.ComponentModel.DataAnnotations;

namespace ReactApp1.Server.Dtos
{
    public record class UserRequest([Required][StringLength(50)] string FirstName, [Required] string LastName, [Required] string Email, [Required] DateTime DateJoined)
    {

    }
}
