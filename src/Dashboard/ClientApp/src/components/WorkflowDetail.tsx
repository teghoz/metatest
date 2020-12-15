import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { ApplicationState } from '../store';
import * as WorkflowStore from '../store/Workflows';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause, faStop, faEye, faPlus } from '@fortawesome/free-solid-svg-icons'

// At runtime, Redux will merge together...
type WorkflowProps =
  WorkflowStore.WorkflowState
  & typeof WorkflowStore.actionCreators
  & RouteComponentProps<{ workflowId: string }>;


class WorkflowDetail extends React.PureComponent<WorkflowProps> {
  public componentDidMount() {
    this.ensureDataFetched();
  }

  public componentDidUpdate() {
    //this.ensureDataFetched();
  }

  public render() {
    return (
      <React.Fragment>
        <h1 id="tabelLabel">{this.props.workflow.workflowDefinitionId} Details</h1>
        <p>This lists all the workflows.</p>
        {this.renderWorkflowDetails()}
      </React.Fragment>
    );
  }

  private ensureDataFetched() {
    const workflowId = this.props.match.params.workflowId;
    this.props.requestWorkflow(workflowId);
  }

  private renderWorkflowDetails() {
    return (
      <React.Fragment>
        <div></div>
        <div className="row">
          <div className="col-md-12">
            <ul className="list-group">
              <li className="list-group-item"><strong>ID:</strong>  <span className="badge badge-primary badge-pill">{this.props.workflow.id}</span></li>
              <li className="list-group-item"><strong>WorkflowDefinitionId:</strong>  <span className="badge badge-primary badge-pill">{this.props.workflow.workflowDefinitionId}</span></li>
              <li className="list-group-item"><strong>Version:</strong>  <span className="badge badge-primary badge-pill">{this.props.workflow.version}</span></li>
              <li className="list-group-item"><strong>Status:</strong>  <span className="badge badge-primary badge-pill">{this.props.workflow.status}</span></li>
              <li className="list-group-item"><strong>Reference:</strong>  <span className="badge badge-primary badge-pill">{this.props.workflow.reference}</span></li>
              <li className="list-group-item"><strong>Create Time:</strong> <span className="badge badge-primary badge-pill">{this.props.workflow.createTime}</span></li>
              <li className="list-group-item"><strong>Complete Time:</strong> <span className="badge badge-primary badge-pill">{this.props.workflow.completeTime}</span></li>
              <li className="list-group-item"><strong>Next Execution Date:</strong> </li>
            </ul>
          </div>         
        </div> <br></br>

        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                Execution Pointers
              </div>
              <div className="card-body">
                <pre>
                  {JSON.stringify(this.props.workflow.executionPointers)}
                </pre>
              </div>
            </div>            
          </div>        
        </div>

        <br></br>

        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                Actions
              </div>
              <div className="card-body">
                      <button 
                        className="btn btn-success"
                        onClick={() => { this.props.resume(this.props.workflow.id); }}>                  
                        <FontAwesomeIcon icon={faPlay} /> Resume
                      </button> &nbsp;
                      <button 
                        className="btn btn-warning"
                        onClick={() => { this.props.suspend(this.props.workflow.id); }}>                 
                        <FontAwesomeIcon icon={faPause} /> Suspend
                      </button> &nbsp;
                      <button className="btn btn-danger"
                        onClick={() => { this.props.stop(this.props.workflow.id); }}>
                        <FontAwesomeIcon icon={faStop} /> Stop
                      </button>
              </div>
            </div>            
          </div>        
        </div>
      </React.Fragment>
    );
  }
}

export default connect(
  (state: ApplicationState) => state.workflowState,
  WorkflowStore.actionCreators
)(WorkflowDetail as any);
