using System.Threading.Tasks;

namespace Hangfire.Enqueuers
{
    public interface IEnqueuedJob<T>
    {
        Task<string> EnqueueJob(T jobParams);
    }
}
