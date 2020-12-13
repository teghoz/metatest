import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface WorkflowState {
    isLoading: boolean;
    workflows: Workflow[];
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

interface RequestWorkflowAction {
    type: 'REQUEST_WORKFLOW';
}

interface ReceiveWorkflowAction {
    type: 'RECEIVE_WORKFLOW';
    workflows: Workflow[];
}

type KnownAction = RequestWorkflowAction | ReceiveWorkflowAction;


export const actionCreators = {
    requestWorkflows: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        const appState = getState();
        if (appState && appState.workflows) {
            fetch(`api/workflows`)
                .then(response => response.json() as Promise<Workflow[]>)
                .then(data => {
                    dispatch({ type: 'RECEIVE_WORKFLOW', workflows: data.data.data });
                });

            dispatch({ type: 'REQUEST_WORKFLOW' });
        }
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: WorkflowState = { workflows: [], isLoading: false };

export const reducer: Reducer<WorkflowState> = (state: WorkflowState | undefined, incomingAction: Action): WorkflowState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_WORKFLOW':
            return {
                workflows: state.workflows,
                isLoading: true
            };
        case 'RECEIVE_WORKFLOW':
            if(action.workflows.length === state.workflows.length || state.workflows.length === 0){              
                return {
                    workflows: action.workflows,
                    isLoading: false
                };
            }
            break;          
    }

    return state;
};
