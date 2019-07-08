import React, { Component } from "react";
import { Tooltip } from "shards-react";

import "./Step.css";

export default class Step extends Component {
    state = {
        open: false,
    }

    toggle = () => {
        this.setState({ open: !this.state.open });
    }

    render = () => {
        const { lang, code, text, step } = this.props;

        const id = `step-container-${step}`;
        
        return (
            <div className="container" id={id}>
                <div>
                    {`${step + 1}: ${text}`}
                </div>
                <Tooltip open={this.state.open} target={`#${id}`} toggle={this.toggle} placement="right">{`${code}: ${lang}`}</Tooltip>
            </div>  
        );
    }
}