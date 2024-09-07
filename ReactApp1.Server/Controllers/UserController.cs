using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ReactApp1.Server.Dtos;
using ReactApp1.Server.Services;
using ReactApp1.Server.Models;
namespace ReactApp1.Server.Controllers
{
    [ApiController]
    [Route("users")]
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;
        private readonly UserService _userService;

        public UserController(ILogger<UserController> logger, UserService userService)
        {
            _logger = logger;
            _userService = userService;
        }

        [HttpGet]
        [Route("get")]
        public async Task<IActionResult> get()
        {
            var users = await _userService.getUsers();
            return Ok(users);
        }

        [HttpGet]
        [Route("get/{id}", Name = "getId")]
        public async Task<IActionResult> getId(int id)
        {
            var user = await _userService.getUserById(id);
            return Ok(user);
        }

        [HttpGet]
        [Route("getDepartment/{id}")]
        public async Task<IActionResult> getDepartmentName(int id)
        {
            var departmentInfo = await _userService.getDepartment(id);
            return Ok(departmentInfo);
        }

        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> post(UserRequest userReq)
        {
            var user = new User { FirstName = userReq.FirstName, LastName = userReq.LastName, Email = userReq.Email, DateJoined = userReq.DateJoined };
            int id = await _userService.createUser(user);
            CreateUserResponse res = new CreateUserResponse(id, user.FirstName, user.LastName, user.Email, user.DateJoined);
            return CreatedAtRoute("getId", new { id = id }, res);
        }

        [HttpPost]
        [Route("addDepartment")]
        public async Task<IActionResult> addDept(DepartmentModel model)
        {
            await _userService.createDept(model);
            return CreatedAtRoute("getId", new { id = model.Id }, model);
        }

        [HttpPut]
        [Route("update/{id}")]
        public async Task<IActionResult> put(UserRequest userReq, int id)
        {
            Console.WriteLine($"Received: {userReq.FirstName}, {userReq.LastName}, {userReq.Email}, {userReq.DateJoined}");
            var user  = new User { FirstName = userReq.FirstName, LastName = userReq.LastName, Email = userReq.Email, DateJoined=userReq.DateJoined };
            await _userService.updateUser(user, id);
            return NoContent();
        }

        [HttpDelete]
        [Route("delete/{id}")]
        public async Task<IActionResult> delete(int id)
        {
            await _userService.deleteUser(id);
            return NoContent();
        }

        [HttpGet]
        [Route("getAllWithDepartment/")]
        public async Task<IActionResult> getWithDepartment()
        {
            var results = await _userService.getUsersWithDepartment();
            return Ok(results);
        }
    }
}
