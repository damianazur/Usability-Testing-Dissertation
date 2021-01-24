import React, { Component } from 'react';
import { Dropdown } from 'react-bootstrap';

export class DropdownGenerator extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    const data = this.props.data;
    const menuItems = [];
    for(let i = 0; i < data.length; i++) {
      let item = data[i];
      let params = JSON.stringify(item.params);

      menuItems.push(
        <Dropdown.Item as="button" type="button" key={i} onSelect={item.onSelectFunction} eventKey={params}>{item.name}</Dropdown.Item>
      );
    }

    return (
      <Dropdown>
        <img 
          src={`${process.env.PUBLIC_URL}/dropDownIcon.png`} 
          alt="downdown down arrow icon" 
          style={{
            width: "10px", 
            height: "15px",  
            position: "absolute", 
            left: "calc(100% - 20px)",
            bottom: "15%",
            "pointerEvents": "none"
          }}
        />

        <Dropdown.Toggle className="dropDownButton" variant="success" id="dropdown-basic">
          {this.props.initalText}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {menuItems}
        </Dropdown.Menu>
      </Dropdown>
    )
  }
}

export default DropdownGenerator;
