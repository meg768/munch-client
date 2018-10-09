
import React from 'react';


import Page from '../components/page.js';
import {Button, Jumbotron} from '../react-bootify';

class Module extends React.Component {
  render() {
    return (
        <Page>
        <Jumbotron>
            <h1>Om Munch</h1>
            <p>


Lorem ipsum dolor sit amet, sea ei debet mundi dolorum. Ius causae latine ad, eos nusquam insolens suscipiantur eu, no quando veniam eloquentiam quo. Nam aeque doming ut, eam id.
            </p>

            <hr/>
            <p>It uses utility classes for typography and spacing to space content out within the larger container.</p>
            <p>
              <Button color="primary" href="/">Learn More</Button>
            </p>
        </Jumbotron>
        </Page>
    );
  }
}

export default Module;
