import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { ApplicationState } from '../store';
import * as WorkflowStore from '../store/Workflows';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause, faStop, faEye, faPlus, faPaperPlane, faCogs } from '@fortawesome/free-solid-svg-icons'
import {handleData} from '../utilities/utils';

// At runtime, Redux will merge together...
type WorkflowProps =
  WorkflowStore.WorkflowState
  & typeof WorkflowStore.actionCreators;


class NewWorkflow extends React.PureComponent<WorkflowProps, {Workflow: string, IsSaved: boolean, Data: string}> {

  constructor(props: any) {
    super(props);
    this.state = { Workflow: '', IsSaved: false, Data: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event: any) {
    this.setState({Workflow: event.target.value});
  }

  handleSubmit(event: any) {
    handleData(`api/workflows`, 'POST', {
      WorkflowId: this.state.Workflow,    
    })
    .then(data => {
        console.log(data.data);
        this.setState({Data: data.data, IsSaved: true});
        console.log("this data",this.state.Data);
    });
    event.preventDefault();
  }


  public componentDidMount() {
    this.ensureDataFetched();
  }

  public componentDidUpdate() {
    //this.ensureDataFetched();
  }

  public render() {
    return (
      <React.Fragment>
        <h1 id="tabelLabel">New Workflow</h1>
        <p>This adds a new workflow.</p>
        {this.renderWorkflowDetails()}
      </React.Fragment>
    );
  }

  private ensureDataFetched() {
    this.props.requestWorkflowConstants();
  }

  private renderNotification(){
    return (
      <React.Fragment>
          <div className="alert alert-success" role="alert">
            <h4 className="alert-heading">Nicely done!</h4>
            <p>Aww yeah, Your job has been posted </p>
            <hr/>
            <p className="mb-0">
              <Link className='btn btn-outline-primary' target="_blank" to={`/hangfire/jobs/details/${this.state.Data}/`}>
                <FontAwesomeIcon icon={faCogs} />  See on Hangfire
              </Link>
            </p>
          </div>
      </React.Fragment>
    );
  }

  private renderWorkflowDetails() {
    return (
      <React.Fragment>
        <div className="row">
          <div className="col-md-12">
            {
              this.state.IsSaved ? this.renderNotification() : null
            }
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <form>
              <div className="form-group">
                <label htmlFor="workflow">Workflow</label>
                <select className="form-control" id="workflow" onChange={this.handleChange}>
                    <option>Select Option</option>
                    {
                      this.props.workflowConstants.map((workflowConstant, index) => {
                        return <option key={`workflowConstant-${index}`} value={workflowConstant}>{workflowConstant}</option>
                      })
                    }                  
                </select>
              </div>
              
              <button type="button" onClick={this.handleSubmit} className="btn btn-primary"><FontAwesomeIcon icon={faPaperPlane} /> Dispatch</button>
            </form>
          </div>         
        </div>
      </React.Fragment>
    );
  }
}

export default connect(
  (state: ApplicationState) => state.workflowState,
  WorkflowStore.actionCreators
)(NewWorkflow as any);
