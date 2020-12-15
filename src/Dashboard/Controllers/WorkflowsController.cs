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
        /// <summary>
        /// Get workflow constants
        /// </summary>
        /// <returns></returns>
        [HttpGet("Constants")]    
        public ActionResult GetWorkflowConstants()
        {
            return Ok(new
            {
                data = _workflowClient.GetWorkflowNames()
            });
        }

        /// <summary>
        /// Get Workflow list
        /// </summary>
        /// <param name="keyword"></param>
        /// <returns></returns>
        [HttpGet("GetWorkflows")]
        public async Task<ActionResult> Get(string keyword)
        {
            return Ok(new
            {
                data = await _workflowClient.GetWorkflows(keyword, null, null, null, null, 0)
            });
        }

        /// <summary>
        /// Get a particular workflow
        /// </summary>
        /// <param name="workflowId"></param>
        /// <returns></returns>
        [HttpGet("GetWorkflow/{workflowId}")]
        public async Task<ActionResult> GetWorkflowById(string workflowId)
        {
            return Ok(new
            {
                data = await _workflowClient.GetWorkflowById(workflowId)
            });
        }

        /// <summary>
        /// Start a particular workflow
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        [HttpPost("StartWorkflow")]
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

        /// <summary>
        /// Resumes a particular Workflow
        /// </summary>
        /// <param name="workflowId"></param>
        /// <returns></returns>
        [HttpPost("{workflowId}/Resume")]
        public async Task<ActionResult> ResumeWorkFlow([FromRoute] string workflowId)
        {
            return Ok(new { data = workflowId});
            // return Ok(new
            // {
            //     data = await _workflowClient.Resume(workflowId)
            // });
        }

        /// <summary>
        /// Suspends a particular Workflow
        /// </summary>
        /// <param name="workflowId"></param>
        /// <returns></returns>
        [HttpPost("{workflowId}/Suspend")]
        public async Task<ActionResult> SuspendWorkFlow([FromRoute] string workflowId)
        {
            return Ok(new
            {
                data = await _workflowClient.Suspend(workflowId)
            });
        }

        /// <summary>
        /// Terminates a particular workflow
        /// </summary>
        /// <param name="workflowId"></param>
        /// <returns></returns>
        [HttpPost("{workflowId}/Stop")]
        public async Task<ActionResult> StopWorkFlow([FromRoute] string workflowId)
        {
            return Ok(new
            {
                data = await _workflowClient.Terminate(workflowId)
            });
        }
    }
}
