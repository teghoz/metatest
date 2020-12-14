import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { ApplicationState } from '../store';
import * as WorkflowStore from '../store/Workflows';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause, faStop, faEye } from '@fortawesome/free-solid-svg-icons'

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

  private _handleDetailButtonClick = () => {

    this.context.router.push({ //browserHistory.push should also work here
      pathname: './WorkflowDetail',
      //state: {yourCalculatedData: data}
    });
} 

  private renderWorkflowTable() {
    return (
      <table className='table table-striped' aria-labelledby="tabelLabel">
        <thead>
          <tr>
            <th>Definition</th>
            <th>Workflow Id</th>
            <th>Version</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {this.props.workflows.map((workflow: WorkflowStore.Workflow) =>
            <tr key={workflow.id}>
              <td>{workflow.workflowDefinitionId}</td>
              <td>{workflow.id}</td>
              <td>{workflow.version}</td>
              <td>
                <button 
                  className="btn btn-primary"
                  onClick={this._handleDetailButtonClick}>
                  <FontAwesomeIcon icon={faEye} /> Details
                </button> &nbsp;
                <button 
                  className="btn btn-success"
                  onClick={() => { this.props.resume(workflow.id); }}>                  
                  <FontAwesomeIcon icon={faPlay} /> Resume
                </button> &nbsp;
                <button 
                  className="btn btn-warning"
                  onClick={() => { this.props.suspend(workflow.id); }}>                 
                  <FontAwesomeIcon icon={faPause} /> Suspend
                </button> &nbsp;
                <button className="btn btn-danger"
                  onClick={() => { this.props.stop(workflow.id); }}>
                  <FontAwesomeIcon icon={faStop} /> Stop
                </button>
              </td>
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
