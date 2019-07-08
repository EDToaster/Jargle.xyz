import React from "react";
import { Button } from "shards-react";

const FourOhFour = (props) => {
    const handleClick = () => {
        props.history.push("/");
    }

    return (
        <div className="column">
            <p>404 - Why are you here?</p>
            <Button onClick={handleClick}>Return!</Button>
        </div>
    );
}

export default FourOhFour;