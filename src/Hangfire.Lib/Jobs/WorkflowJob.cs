using System;
using System.Threading.Tasks;
using Hangfire.Jobs;
using Newtonsoft.Json.Linq;
using Workflow.Client;

namespace Hangfire.Lib.Jobs
{
    public class WorkflowJob : IWorkflowJob
    {
        private IWorkflowClient _workflowClient;
        public WorkflowJob(IWorkflowClient workflowClient)
        {
            _workflowClient = workflowClient;
        }
        public Task<string> Start(string workflowId, int? version, string reference, JObject data)
        {
            return _workflowClient.Start(workflowId, version, reference, data);
        }
    }
}
