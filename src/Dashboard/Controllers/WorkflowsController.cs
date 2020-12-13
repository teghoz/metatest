using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hangfire.Enqueuers;
using Hangfire.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Workflow.Client;

namespace Dashboard.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WorkflowsController : ControllerBase
    {
        IWorkflowClient _workflowClient;
        IEnqueuedJob<WorkflowParams> _enqueuedJob;

        public WorkflowsController(IWorkflowClient workFlowClient, IEnqueuedJob<WorkflowParams> enqueuedJob)
        {
            _workflowClient = workFlowClient;
            _enqueuedJob = enqueuedJob;
        }
        [HttpGet("Constants")]
        public ActionResult GetWorkflowConstants()
        {
            return Ok(new
            {
                data = _workflowClient.GetWorkflowNames()
            });
        }
        [HttpGet]
        public async Task<ActionResult> Get(string keyword)
        {
            return Ok(new
            {
                data = await _workflowClient.GetWorkflows(keyword, null, null, null, null, 0)
            });
        }

        [HttpGet("Workflow/{workflowId}")]
        public async Task<ActionResult> GetWorkflowById(string workflowId)
        {
            return Ok(new
            {
                data = await _workflowClient.GetWorkflowById(workflowId)
            });
        }

        [HttpPost]
        public ActionResult StartWorkFlow([FromBody] WorkflowPayload data)
        {
            var workflowParams = new WorkflowParams
            {
                WorkflowId = data.WorkflowId
            };

            var job = _enqueuedJob.EnqueueJob(workflowParams);
            

            return Ok(new
            {
                data = job
            });
        }

        [HttpPost("{workflowId}/Actions")]
        public async Task<ActionResult> ResumeWorkFlow(string workflowId)
        {
            return Ok(new
            {
                data = await _workflowClient.Resume(workflowId)
            });
        }

        [HttpPatch("{workflowId}/Actions")]
        public async Task<ActionResult> SuspendWorkFlow(string workflowId)
        {
            return Ok(new
            {
                data = await _workflowClient.Suspend(workflowId)
            });
        }

        [HttpDelete("{workflowId}/Actions")]
        public async Task<ActionResult> StopWorkFlow(string workflowId)
        {
            return Ok(new
            {
                data = await _workflowClient.Terminate(workflowId)
            });
        }
    }
}
