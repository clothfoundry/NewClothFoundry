import Cx from 'classnames'
import React from 'react'

class Img extends React.Component {
  state = {
    loaded: false,
    src: '',
  }

  static getDerivedStateFromProps(props, state) {
    // Reset loaded status if src prop changes
    if (props.src !== state.src) {
      return {
        loaded: false,
        src: props.src,
      }
    }
    // No state update necessary
    return null
  }
  
  componentDidMount() {
    // console.log('Img.componentDidMount')
    if (this.img.complete && !this.state.loaded) {
      this.onLoad()
    }
  }

  componentDidUpdate() {
    // console.log('Img.componentDidUpdate', this.img.src, this.img.complete, this.state.loaded)
    if (this.img.complete && !this.state.loaded) {
      this.onLoad()
    }
  }

  onLoad = () => {
    // console.log('Img.onLoad', this.img.src, this.state.loaded)
    setTimeout(() => {
      this.setState({loaded: true})
      if (this.props.onLoad) this.props.onLoad()
    }, 10)
  }

  render() {
    let {className, readyClassName, onLoad, ...rest} = this.props
    let cn = Cx(className, {[readyClassName]: this.state.loaded})
    return (
      <img
        className={cn}
        onLoad={this.onLoad}
        {...rest}
        ref={c => {this.img = c}} />
    )
  }
}

export default Img