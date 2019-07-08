import React, { Component } from "react";
import { FormInput, Button, Slider } from "shards-react";
import { Step } from "../components";
import _t from "google-translate";

import "./styles.css";

const Translate = _t("AIzaSyCAyw_dO-xR6YHGssvVW77-2ladzoUdMN0");

const promiseTranslate = (text, lang) => {
    return new Promise((resolve, reject) => {
      Translate.translate(text, lang, (err, translation) => {
        if (err) {
          reject(err);
        } else {
          resolve(translation);
        }
      });
    });
  }

const getInitialState = () => (
    {
        input: "",
        num: 5,
        submitted: false,
        translating: false,
        finished: false,
        translation: [],
    }
);

export default class Start extends Component {
    state = getInitialState();

    handleInputChange = (event) => {
        const { target } = event;
        const { value } = target;

        this.setState({
            input: value,
        });
    }

    handleSliderChange = (event) => {
        const [ numStr ] = event;
        const num = parseInt(numStr);

        this.setState({
            num,
        });
    }

    promiseSetState = (state) => new Promise((resolve, reject) => {
        this.setState(state, resolve);
    });

    handleSubmit = async (event) => {
        const { num, input } = this.state;

        if (input.trim().length === 0) return;

        this.setState({ submitted: true, translating: true });
        
        // const translation = await API.post("TranslateAPI", "/translate", { body: { num, input } }); 
        Translate.getSupportedLanguages('en', async (err, languages) => {
            const languageMap = languages.reduce((prev, curr) => {
              const { language, name } = curr;
              prev[language] = name;
              return prev;
            }, {});
        
            const langs = Object.keys(languageMap);
        
            const plan = Array.apply(null, { length: num }).map(() => langs[Math.floor(langs.length * Math.random())]).reduce(
              (prev, curr) => [ ...prev, curr ],
              []
            );

            plan.push("en");
        
            console.log("Translation plan:", plan);
        
            let prev = "en";
            let prevText = input;
        
            await this.promiseSetState({ translation: [ ... this.state.translation, { code: prev, lang: languageMap[prev], text: prevText }]});
        
            for (let step of plan) {
              const translation = await promiseTranslate(prevText, step);
              const { translatedText } = translation;
        
              prevText = translatedText;
              prev = step;
              console.log(prev, languageMap[prev], prevText);
              await this.promiseSetState({ translation: [ ... this.state.translation, { code: prev, lang: languageMap[prev], text: prevText }]});
            }

            await this.promiseSetState({ finished: true, translating: false })
        });
    }

    handleReset = (event) => {
        this.setState(getInitialState());
    }

    render = () => {
        const { submitted, num, input, translation, translating } = this.state;
        return (
            submitted ? (
                <div className="column">
                    {
                        translating ? <p>Translating ...</p> : <p></p>
                    }
                    {
                        translation.map((t, i) => (<Step lang={t.lang} code={t.code} text={t.text} key={i} step={i}/>))
                    }
                    <Button onClick={this.handleReset}>Reset</Button>
                </div>
            )
             : 
            <div className="column">
                <FormInput 
                    id="textinput" 
                    placeholder="Type here" 
                    size="lg" 
                    onChange={this.handleInputChange} 
                    value={input} />
                <p>Translations: {num}</p>
                <Slider className="slider"
                    connect={[true, false]}
                    theme="success"
                    onSlide={this.handleSliderChange}
                    start={[num]}
                    range={{ min: 1, max: 20 }}
                />
                <Button onClick={this.handleSubmit}>Jargle me!</Button>
            </div>
        );
    }

}