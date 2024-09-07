namespace ReactApp1.Server.Models
{
    public class UserAndDepartmentModel
    {
        public int? Id { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string Email { get; set; }
        public required DateTime DateJoined { get; set; }

        public required string Department { get; set; }
    }
}
