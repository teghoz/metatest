using System;
using System.Threading.Tasks;
using Hangfire.Enqueuers;
using Hangfire.Jobs;
using Hangfire.Models;

namespace Hangfire.Lib.Enqueuers
{
    public class EnqueuedJob : IEnqueuedJob<WorkflowParams>
    {
        private IWorkflowJob _workflowJob;
        public EnqueuedJob(IWorkflowJob workflowJob)
        {
            _workflowJob = workflowJob;
        }
        public string EnqueueJob(WorkflowParams jobParams)
        {
            return BackgroundJob.Enqueue(() => _workflowJob.Start(jobParams.WorkflowId, jobParams.Version, jobParams.Reference, jobParams.Data));
        }
    }
}
