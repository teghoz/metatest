import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface WorkflowState {
    isLoading: boolean;
    workflows: Workflow[];
    workflow: Workflow;
}

export interface Workflow {
    id: any;
    workflowDefinitionId: any;
    version: number;
    description: string;
    reference: string;
    nextExecutionUtc: string;
    status: any;
    data: any[];
    createTime: any;
    completeTime: any;
    waitingSteps: any[],
    sleepingSteps: any[],
    failedSteps: any[]
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface RequestWorkflowsAction {
    type: 'REQUEST_WORKFLOWS';
}

interface ReceiveWorkflowsAction {
    type: 'RECEIVE_WORKFLOWS';
    workflows: Workflow[];
}

interface RequestWorkflowAction {
    type: 'REQUEST_WORKFLOW';
}

interface ReceiveWorkflowAction {
    type: 'RECEIVE_WORKFLOW';
    workflow: Workflow;
}



interface ResumeWorkflowAction { type: 'RESUME_WORKFLOW' }
interface SuspendWorkflowAction { type: 'SUSPEND_WORKFLOW' }
interface StopWorkflowAction { type: 'STOP_WORKFLOW' }

type KnownAction = RequestWorkflowsAction | 
ReceiveWorkflowsAction |
RequestWorkflowAction |
ReceiveWorkflowAction |
ResumeWorkflowAction |
SuspendWorkflowAction |
StopWorkflowAction;


async function handleData (url = '', method = "POST", data = {}) {
    const response = await fetch(url, {
      method: method,
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    });
    return response.json();
};

export const actionCreators = {
    startWorkflow: (workflow: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        handleData(`api/workflows`, 'POST', {
            "WorkflowId": workflow
        })
        .then(data => {
            console.log(data); // JSON data parsed by `data.json()` call
        });
    },
    requestWorkflows: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        const appState = getState();
        if (appState && appState.workflows) {
            fetch(`api/workflows`)
                .then(response => response.json())
                .then(data => {
                    dispatch({ type: 'RECEIVE_WORKFLOWS', workflows: data.data.data as Workflow[]});
                });

            dispatch({ type: 'REQUEST_WORKFLOWS' });
        }
    },
    requestWorkflow: (workflowId: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.workflow) {
            fetch(`api/workflows/workflow/${workflowId}`)
                .then(response => response.json())
                .then(data => {
                    dispatch({ type: 'RECEIVE_WORKFLOW', workflow: data as Workflow});
                });

            dispatch({ type: 'REQUEST_WORKFLOW' });
        }   
    },
    resume: (workflowId: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        handleData(`api/workflows/${workflowId}/actions`, 'POST', {})
        .then(data => {
            console.log(data); // JSON data parsed by `data.json()` call
        });
    },
    suspend: (workflowId: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        handleData(`api/workflows/${workflowId}/actions`, 'PATCH', {})
        .then(data => {
            console.log(data); // JSON data parsed by `data.json()` call
        });
    },
    stop: (workflowId: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        handleData(`api/workflows/${workflowId}/actions`, 'DELETE', {})
        .then(data => {
            console.log(data); // JSON data parsed by `data.json()` call
        });
    },
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: WorkflowState = { workflows: [], isLoading: false, workflow: {} };

export const reducer: Reducer<WorkflowState> = (state: WorkflowState | undefined, incomingAction: Action): WorkflowState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_WORKFLOWS':
            return {
                workflows: state.workflows,
                isLoading: true
            };
        case 'RECEIVE_WORKFLOWS':
            if(action.workflows.length !== state.workflows.length || state.workflows.length === 0){              
                return {
                    workflows: action.workflows,
                    isLoading: false
                };
            }
            break; 
        case 'REQUEST_WORKFLOW':
                return {
                    workflow: state.workflow,
                    isLoading: true
                };
        case 'RECEIVE_WORKFLOW':
                return {
                    workflow: action.workflow,
                    isLoading: false
                };
                break; 
        case 'RESUME_WORKFLOW':
            break;
        case 'SUSPEND_WORKFLOW':
            break;
        case 'STOP_WORKFLOW':
            break;
    }

    return state;
};
