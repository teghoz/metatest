import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { ApplicationState } from '../store';
import * as WorkflowStore from '../store/Workflows';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause, faStop, faEye, faPlus } from '@fortawesome/free-solid-svg-icons'

// At runtime, Redux will merge together...
type WorkflowProps =
  WorkflowStore.WorkflowState // ... state we've requested from the Redux store
  & typeof WorkflowStore.actionCreators; // ... plus action creators we've requested


class Workflows extends React.PureComponent<WorkflowProps> {
  public componentDidMount() {
    this.ensureDataFetched();
  }

  public componentDidUpdate() {
    //this.ensureDataFetched();
  }

  public render() {
    return (
      <React.Fragment>
        <h1 id="tabelLabel">Workflows</h1>
        <p>This lists all the workflows.</p>
        {this.renderWorkflowTable()}
      </React.Fragment>
    );
  }

  private ensureDataFetched() {
    this.props.requestWorkflows();
  }

  private renderWorkflowTable() {
    return (
      <React.Fragment>
        <div className="row">
          <div className="col">
            <Link className='btn btn-outline-primary' to={`/NewWorkflow/`}>
              <FontAwesomeIcon icon={faPlus} />  Start New Workflow
            </Link>          
          </div>     
          <br></br>
          <br></br>    
        </div>
        <div className="row">
          <div className="col">
            <table className='table table-striped' aria-labelledby="tabelLabel">
              <thead>
                <tr>
                  <th>Definition</th>
                  <th>Workflow Id</th>
                  <th>Version</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {this.props.workflows.map((workflow: WorkflowStore.Workflow) =>
                  <tr key={workflow.id}>
                    <td>{workflow.workflowDefinitionId}</td>
                    <td>{workflow.id}</td>
                    <td>{workflow.version}</td>
                    <td>{workflow.status}</td>
                    <td>
                      <Link className='btn btn-primary' to={`/WorkflowDetail/${workflow.id}`}>
                        <FontAwesomeIcon icon={faEye} /> Details
                      </Link> &nbsp;
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
          </div>          
        </div>
      </React.Fragment>      
    );
  }
}

export default connect(
  (state: ApplicationState) => state.workflowState,
  WorkflowStore.actionCreators
)(Workflows as any);
