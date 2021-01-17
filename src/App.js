import React, { useState, useEffect } from "react";
import CaptchaTextGenerator from 'captcha-text-generator';
import Captcha from './captcha/captcha.js';

const App = () => {
  const [captcha, setCaptcha] = useState('');
  const result = (text) => {
    setCaptcha(text);
  }

  return (
      <div>
        <div className="my_text"> welcome </div>
        <CaptchaTextGenerator
          result={result} //Callback function to get text
          originText='nosfe ton perneis pou kai pou' // put your customize random text
        />
        <Captcha />
      </div>
    );
}


export default App;
