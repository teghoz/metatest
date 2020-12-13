import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { ApplicationState } from '../store';
import * as WorkflowStore from '../store/Workflows';

// At runtime, Redux will merge together...
type WorkflowProps =
  WorkflowStore.WorkflowState // ... state we've requested from the Redux store
  & typeof WorkflowStore.actionCreators; // ... plus action creators we've requested


class Workflows extends React.PureComponent<WorkflowProps> {
  public componentDidMount() {
    this.ensureDataFetched();
  }

  public componentDidUpdate() {
    this.ensureDataFetched();
  }

  public render() {
    return (
      <React.Fragment>
        <h1 id="tabelLabel">Workflows</h1>
        <p>This lists all the workflows.</p>
        {this.renderWorkflowTable()}
        {this.renderPagination()}
      </React.Fragment>
    );
  }

  private ensureDataFetched() {
    this.props.requestWorkflows();
  }

  private renderWorkflowTable() {
    return (
      <table className='table table-striped' aria-labelledby="tabelLabel">
        <thead>
          <tr>
            <th>Workflow Id</th>
            <th>Version</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {console.log("ll: ", this.props)}
          {this.props.workflows.map((workflow: WorkflowStore.Workflow) =>
            <tr key={workflow.id}>
              <td>{workflow.id}</td>
              <td>{workflow.version}</td>
              <td>{workflow.description}</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  private renderPagination() {

    return (
      <div className="d-flex justify-content-between">
        <Link className='btn btn-outline-secondary btn-sm' to={`/fetch-data/`}>Previous</Link>       
        {this.props.isLoading && <span>Loading...</span>}
        <Link className='btn btn-outline-secondary btn-sm' to={`/fetch-data/`}>Next</Link>
      </div>
    );
  }
}

export default connect(
  (state: ApplicationState) => state.workflows,
  WorkflowStore.actionCreators
)(Workflows as any);
