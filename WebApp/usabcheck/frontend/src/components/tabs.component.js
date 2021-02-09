import React, { Component } from 'react';

export class TabGenerator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tabButtons: [],
      tabIndex: "0",
      createdComponentList: []
    };
  }

  async componentDidMount() {
    const inputData = this.props.data;
    var components = []
    for(let i = 0; i < inputData.length; i++) {
      let item = inputData[i];
      let tabComponent = item.tabComponent;

      components.push(tabComponent);
    }

    console.log(components);
    this.renderTabButtons("0");
    this.createTabContent(components);
  }

  createTabContent(components) {
    console.log("CREATING TABS");
    var createdComponentList = []

    for (let i = 0; i < components.length; i++) {
      var DynamicTab = components[i];
      let ref = React.createRef();

      createdComponentList.push(
        <DynamicTab 
          key={i} 
          ref={ref}
          testId={this.props.testId}>
        </DynamicTab>
      );
    }

    this.setState({
      createdComponentList: createdComponentList
    }, () => {
      this.renderTab(0);
    });
  }

  renderTabButtons(selectedIndex) {
    const inputData = this.props.data;
    const tabButtons = [];
    for(let i = 0; i < inputData.length; i++) {
      let item = inputData[i];
      let label = item.label;

      tabButtons.push(
        <button key={i} className={selectedIndex === i.toString() ? 'tabButton-active' : 'tabButton'} onClick={this.tabSelect.bind(this, i.toString())}>
          {label}
        </button>
      );
    }

    this.setState({
      tabButtons: tabButtons,
      tabIndex: selectedIndex
    });
  }

  tabSelect(tabIndex) {
    this.renderTabButtons(tabIndex);
    this.renderTab(tabIndex)
  }

  renderTab(tabIndex) {
    var createdComponentList = this.state.createdComponentList;

    for (var i = 0; i < createdComponentList.length; i++) {
      createdComponentList[i].ref.current.setState({isShown: false});
    }

    if (createdComponentList[tabIndex].ref.current != null) {
      createdComponentList[tabIndex].ref.current.setState({isShown: true});
    }
  }

  render() {
    return (
      <div>
        {this.state.tabButtons}
        <div className="tabBody">
        
        {this.state.createdComponentList.length > 0 ? (
          <div>
            {this.state.createdComponentList}
          </div>
        ) : (
          <span>No Tasks Found!!</span>
        )}
        </div>
      </div>
    )
  }
}

export default TabGenerator;
