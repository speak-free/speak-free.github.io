
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { CaptchaWrapper } from './style.js'
import {Helmet} from "react-helmet";

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}

function genetateCaptcha(max) {
  let text = ''
  let i
  for (i = 0; i < max; i += 1) {
    switch (Math.floor(Math.random() * 3)) {
      case 0: text += String.fromCharCode(48 + Math.floor(Math.random() * 10)); break
      case 1: text += String.fromCharCode(65 + Math.floor(Math.random() * 26)); break
      case 2: text += String.fromCharCode(97 + Math.floor(Math.random() * 26)); break
      default: break
    }
  }
  return "nosfe ton perneis pou kai pou"
}

class Captcha extends Component {
  state = { solution: genetateCaptcha(this.props.length), input: '' , meta: ''};

  componentDidMount = () => {
    var myFont = new FontFace('lovelycoffee', 'url(LovelyCoffee.ttf)');
    myFont.load().then(function(font){
      // with canvas, if this is ommited won't work
      document.fonts.add(font);
      console.log('Font loaded');
      this.drawCaptcha();
    }.bind(this));
  };

  dataURItoBlob = (dataURI) => {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    //Old Code
    //write the ArrayBuffer to a blob, and you're done
    //var bb = new BlobBuilder();
    //bb.append(ab);
    //return bb.getBlob(mimeString);

    //New Code
    return new Blob([ab], {type: mimeString});


  }

  drawCaptcha = () => {
    const { solution } = this.state
    const { width, height } = this.canvas
    const ctx = this.canvas.getContext('2d')
    ctx.clearRect(0, 0, width, height)
    ctx.font = `${getRandomInt(30, 40)}px lovelycoffee`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(solution, width / 2, height / 2 + 3)
    ctx.strokeStyle = 'purple'

//    ctx.beginPath(),
//    ctx.moveTo(getRandomInt(5, 20), getRandomInt(5, 20)), ctx.lineTo(width - getRandomInt(5, 20), height - getRandomInt(5, 20)), ctx.stroke(),
//    ctx.moveTo(getRandomInt(15, 30), getRandomInt(15, 30)), ctx.lineTo(width - getRandomInt(15, 30), height - getRandomInt(15, 30)), ctx.stroke(),
//    ctx.moveTo(getRandomInt(5, 20), height - getRandomInt(5, 20)), ctx.lineTo(width - getRandomInt(5, 20), getRandomInt(5, 20)), ctx.stroke(),
//    ctx.moveTo(getRandomInt(15, 30), height - getRandomInt(15, 30)), ctx.lineTo(width - getRandomInt(15, 30), getRandomInt(15, 30)), ctx.stroke(),
//    ctx.moveTo(getRandomInt(width / 10, (width / 10) + 10), height - getRandomInt(15, 30)), ctx.lineTo(getRandomInt(width / 2, width / 2 + 10), getRandomInt(5, 20)), ctx.stroke(),
//    ctx.closePath()
    console.log(this.canvas.toDataURL());
    var data = this.dataURItoBlob(this.canvas.toDataURL());
    var csvURL = window.URL.createObjectURL(data);
    var tempLink = document.createElement('a');
    tempLink.href = csvURL;
    this.setState({meta: csvURL})
    console.log(tempLink);
  };



  refresh = () => {
    const { onRefresh } = this.props
    this.setState(
      {
        solution: genetateCaptcha(this.props.length),
        input: ''
      },
      () => this.drawCaptcha()
    )
    onRefresh()
  };

  playAudio = () => {
    const { solution } = this.state
    const audio = new SpeechSynthesisUtterance(
      solution
        .toString()
        .split('')
        .join(' ')
    )
    audio.rate = 0.6
    window.speechSynthesis.speak(audio)
  };

  handleChange = e => {
    const { onChange } = this.props
    const { solution } = this.state
    this.setState({ input: e.target.value })
    onChange(e.target.value === solution.toString())
  };

  render() {
    const { placeholder } = this.props
    const { input, meta } = this.state

    return (
      <CaptchaWrapper>
        <Helmet>
          <meta property="og:image" content={meta} />
        </Helmet>
        <div className='rnc'>
          <div className='rnc-row'>
            <canvas
              ref={el => (this.canvas = el)}
              width={600}
              height={314}
              className='rnc-canvas'
              data-testid='captcha-canvas'
            />
          </div>
        </div>
      </CaptchaWrapper>
    )
  }
}

Captcha.defaultProps = {
  placeholder: 'Insert captcha',
  length: 6
}

Captcha.propTypes = {
  onChange: PropTypes.func,
  onRefresh: PropTypes.func,
  placeholder: PropTypes.string,
  length: PropTypes.number
}

export default Captcha
