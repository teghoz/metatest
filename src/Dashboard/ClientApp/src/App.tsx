import * as React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';
import Counter from './components/Counter';
import Workflows from './components/Workflows';
import NewWorkflow from './components/NewWorkflow';
import WorkflowDetail from './components/WorkflowDetail';
//import Workflows from './components/Workflows';
import FetchData from './components/FetchData';

import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faCheckSquare, faCoffee, faPlay} from '@fortawesome/free-solid-svg-icons'

import './custom.css'

export default () => (
    <Layout>
        <Route path='/home' component={Home} />
        <Route path='/counter' component={Counter} />
        <Route path='/workflows' component={Workflows} />
        <Route path='/NewWorkflow' component={NewWorkflow} />
        <Route path='/workflowDetail/:workflowId' component={WorkflowDetail} />
        <Route path='/fetch-data/:startDateIndex?' component={FetchData} />
    </Layout>
);
