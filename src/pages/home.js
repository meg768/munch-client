
import React from 'react';


import { Button, Jumbotron } from 'reactstrap';
import Page from '../components/page.js';

class Module extends React.Component {
  render() {
    return (
        <Page>
        <Jumbotron>
            <h1>Munch</h1>
            <p >
Lorem ipsum dolor sit amet, iriure mnesarchum eos no. Et sea maiorum qualisque voluptatum, regione integre epicurei mel eu. Eu decore evertitur pertinacia eos, his an modo invidunt. Unum noster eum ad. Suas commune ea qui, mel detracto maluisset prodesset te, sit eu sensibus oportere. Ut nam vidit antiopam recteque.

            </p>
            <hr/>
            <p>It uses utility classes for typography and spacing to space content out within the larger container.</p>
            <p>
              <Button color="primary">Learn More</Button>
            </p>
        </Jumbotron>
        </Page>
    );
  }
}

export default Module;
