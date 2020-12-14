import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { ApplicationState } from '../store';
import * as WorkflowStore from '../store/Workflows';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause, faStop, faEye } from '@fortawesome/free-solid-svg-icons'

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
    this.ensureDataFetched();
  }

  public render() {
    return (
      <React.Fragment>
        <h1 id="tabelLabel">Workflows Details</h1>
        <p>This lists all the workflows.</p>
        {this.renderWorkflowDetails()}
      </React.Fragment>
    );
  }

  private ensureDataFetched() {
    console.log("props: ", this.props);
    const workflowId = this.props.match.params.workflowId;
    this.props.requestWorkflow(workflowId);
  }

  private renderWorkflowDetails() {
    return (
      <div>
        <div></div>
        <div>
          <ul className="list-group">
            <li className="list-group-item">ID:  <strong>{this.props.workflow.id}</strong></li>
            <li className="list-group-item">WorkflowDefinitionId:  <strong>{this.props.workflow.workflowDefinitionId}</strong></li>
            <li className="list-group-item">Version:  <strong>{this.props.workflow.version}</strong></li>
            <li className="list-group-item">Status:  <strong>{this.props.workflow.status}</strong></li>
            <li className="list-group-item">Reference:  <strong>{this.props.workflow.reference}</strong></li>
            <li className="list-group-item">Create Time:  <strong>{this.props.workflow.createTime}</strong></li>
            <li className="list-group-item">Complete Time:  <strong>{this.props.workflow.completeTime}</strong></li>
            <li className="list-group-item">Next Execution Date: </li>
            <li className="list-group-item">Data: </li>
            <li className="list-group-item">Failed Steps</li>
            <li className="list-group-item">Vestibulum at eros</li>
            <li className="list-group-item">Vestibulum at eros</li>
            <li className="list-group-item">Vestibulum at eros</li>
          </ul>
        </div>
      </div>     
    );
  }
}

export default connect(
  (state: ApplicationState) => state.workflows,
  WorkflowStore.actionCreators
)(WorkflowDetail as any);
