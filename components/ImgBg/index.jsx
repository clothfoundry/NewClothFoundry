import Cx from 'classnames'
import React from 'react'

class ImgBg extends React.Component {
  state = {
    ready: false
  }

  onLoad = () => {
    this.setState({ready: true}, () => {
      if (this.props.onLoad) this.props.onLoad()
    })
  }
  
  componentDidMount() {
    const img = new Image()
    img.onload = this.onLoad
    img.src = this.props.src
    this._img = img
  }

  componentWillUnmount() {
    this._img.onload = function() {}
    delete this._img
  }

  render() {
    let {src, className, readyClassName, style, ...rest} = this.props
    const cn = Cx(
      className,
      {[readyClassName]: this.state.ready}
    )
      
    const divStyle = Object.assign({}, style)
    if (this.state.ready) {
      divStyle['backgroundImage'] = 'url(' + src + ')'
    }

    return (
      <div className={cn} style={divStyle} {...rest} />
    )
  }
}

export default ImgBg