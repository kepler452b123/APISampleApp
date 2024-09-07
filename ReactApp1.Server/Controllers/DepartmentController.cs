using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ReactApp1.Server.Dtos;
using ReactApp1.Server.Services;
using ReactApp1.Server.Models;
using Microsoft.AspNetCore.Http.HttpResults;


//Check to make sure there is no duplicate before adding to Departments. Do this using a self join.
namespace ReactApp1.Server.Controllers
{
    [ApiController]
    [Route("departments")]
    public class DepartmentController : ControllerBase
    {
        private readonly ILogger<DepartmentController> _logger;
        private readonly DepartmentService _deptService;

        public DepartmentController(ILogger<DepartmentController> logger, DepartmentService service)
        {
            _logger = logger;
            _deptService = service;
        }

        [HttpGet]
        [Route("get")]
        public async Task<IActionResult> getAll()
        {
            var results = await _deptService.getAll();
            return Ok(results);
        }

        [HttpGet]
        [Route("get/{name}")]
        public async Task<IActionResult> getAllUsersInDept(string name)
        {
            var results = await _deptService.getAllUsersByDept(name);
            return Ok(results);
        }

    }
}
