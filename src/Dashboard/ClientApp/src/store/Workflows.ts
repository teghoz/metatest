import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';
import {handleData} from '../utilities/utils';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface WorkflowState {
    isLoading: boolean;
    workflows: Workflow[];
    workflow: Workflow;
    workflowConstants: any[];
}

export enum WorkflowStatus{
    Runnable = 0,
    Suspended = 1,
    Complete = 2,
    Terminated = 3
}

export interface Workflow {
    id: any;
    workflowDefinitionId: any;
    version: number;
    description: string;
    reference: string;
    nextExecutionUtc: string;
    status: WorkflowStatus;
    data: any[];
    createTime: any;
    completeTime: any;
    waitingSteps: any[],
    sleepingSteps: any[],
    failedSteps: any[],
    executionPointers: any[]
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
    workflow: Workflow;
}

interface ReceiveWorkflowAction {
    type: 'RECEIVE_WORKFLOW';
    workflow: Workflow;
}



interface ResumeWorkflowAction { type: 'RESUME_WORKFLOW' }
interface SuspendWorkflowAction { type: 'SUSPEND_WORKFLOW' }
interface StopWorkflowAction { type: 'STOP_WORKFLOW' }
interface RequestWorkflowConstantsAction { type: 'REQUEST_WORKFLOW_CONSTANTS' }
interface RecieveWorkflowConstantsAction { type: 'RECIEVE_WORKFLOW_CONSTANTS',  workflowConstants: [] }

type KnownAction = RequestWorkflowsAction | 
ReceiveWorkflowsAction |
RequestWorkflowAction |
ReceiveWorkflowAction |
ResumeWorkflowAction |
SuspendWorkflowAction |
RequestWorkflowConstantsAction |
RecieveWorkflowConstantsAction |
StopWorkflowAction;


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
        if (appState && appState.workflowState) {
            fetch(`api/workflows`)
                .then(response => response.json())
                .then(data => {
                    dispatch({ type: 'RECEIVE_WORKFLOWS', workflows: data.data.data as Workflow[]});
                });

            dispatch({ type: 'REQUEST_WORKFLOWS' });
        }
    },
    requestWorkflowConstants: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        const appState = getState();
        if (appState && appState.workflowState) {
            fetch(`api/workflows/constants`)
                .then(response => response.json())
                .then(data => {
                    dispatch({ type: 'RECIEVE_WORKFLOW_CONSTANTS', workflowConstants: data.data});
                });
            dispatch({ type: 'REQUEST_WORKFLOW_CONSTANTS' });
        }
    },
    requestWorkflow: (workflowId: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.workflowState) {
            fetch(`api/workflows/workflow/${workflowId}`)
                .then(response => response.json())
                .then(data => {
                    dispatch({ type: 'RECEIVE_WORKFLOW', workflow: data.data as Workflow});
                });

            dispatch({ type: 'REQUEST_WORKFLOW', workflow: <Workflow>{} });
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

const unloadedState: WorkflowState = { workflows: [], isLoading: false, workflow: <Workflow>{}, workflowConstants: [] };

export const reducer: Reducer<WorkflowState> = (state: WorkflowState | undefined, incomingAction: Action): WorkflowState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_WORKFLOWS':
            return {
                workflows: state.workflows,
                isLoading: true,
                workflow: state.workflow,
                workflowConstants: []
            };
        case 'RECEIVE_WORKFLOWS':
            if(action.workflows.length !== state.workflows.length || state.workflows.length === 0){              
                return {
                    workflows: action.workflows,
                    isLoading: false,
                    workflow: <Workflow>{},
                    workflowConstants: []
                };
            }
            break; 
        case 'REQUEST_WORKFLOW':       
            return {
                workflow: state.workflow,
                isLoading: true,
                workflows: [],
                workflowConstants: []
            };
        case 'RECEIVE_WORKFLOW':
            if(action.workflow.id !== state.workflow.id || state.workflow == null){ 
                return {
                    workflow: action.workflow,
                    isLoading: false,
                    workflows: [],
                    workflowConstants: []
                };
            }
            break; 
        case 'RECIEVE_WORKFLOW_CONSTANTS':
            if(action.workflowConstants.length !== state.workflowConstants.length || state.workflowConstants.length === 0){
                return {
                    workflow: <Workflow>{},
                    isLoading: false,
                    workflows: [],
                    workflowConstants: action.workflowConstants
                };
            }           
            break;
        case 'REQUEST_WORKFLOW_CONSTANTS':
            return {
                workflow: <Workflow>{},
                isLoading: true,
                workflows: [],
                workflowConstants: state.workflowConstants
            };
        case 'RESUME_WORKFLOW':
            break;
        case 'SUSPEND_WORKFLOW':
            break;
        case 'STOP_WORKFLOW':
            break;
    }

    return state;
};
