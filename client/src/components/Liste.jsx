import React from 'react';




export default class Liste extends React.Component {

    render(){
        return(
            <div className="liste">
      <h2>Liste des valeurs</h2>
      <table>
          <tbody>
{this.props.addresses.map((addresse) => (
  <tr><td>{addresse.returnValues.modifierAddress}</td><td>{addresse.returnValues.data}</td></tr>
))}
</tbody>
        </table>
    </div>
        )
    }

}
