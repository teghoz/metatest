using System.Threading.Tasks;
using Hangfire;
using Newtonsoft.Json.Linq;

namespace Hangfire.Jobs
{
    public interface IWorkflowJob
    {
        [Queue("workflow")]
        [AutomaticRetry(Attempts = 3, OnAttemptsExceeded = AttemptsExceededAction.Delete)]
        Task<string> Start(string workflowId, int? version, string reference, JObject data);
    }
}