import * as React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';
import Counter from './components/Counter';
import Workflows from './components/Workflows';
import FetchData from './components/FetchData';

import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faCheckSquare, faCoffee, faPlay} from '@fortawesome/free-solid-svg-icons'

import './custom.css'

export default () => (
    <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/counter' component={Counter} />
        <Route path='/workflow' component={Workflows} />
        <Route path='/fetch-data/:startDateIndex?' component={FetchData} />
    </Layout>
);
