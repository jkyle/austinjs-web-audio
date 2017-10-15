import React, { Component } from 'react'

export default WrappedComponent =>
  class Device extends Component {
    constructor(props) {
      super(props)
      this.props.device.register(() => this.setState({}))
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }
