import React from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { Start, Display, FourOhFour } from '../../pages';

import "./Container.css";

const Container = ({location}) => {
    return (
        <div>    
            <TransitionGroup>
                <CSSTransition
                key={location.key}
                timeout={{ enter: 700, exit: 0 }}
                classNames={"fade"}
                >
                    <Switch location={location}>
                        <Route path="/" exact component={Start}/>
                        <Route path="/display" exact component={Display}/>
                        <Route component={FourOhFour}/>
                    </Switch>
                </CSSTransition>
            </TransitionGroup>
        </div>
    );   
}

export default withRouter(Container);