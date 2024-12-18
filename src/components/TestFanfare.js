import React, { useEffect, useState } from "react";
import Fanfare from "./Fanfare";

function TestFanfare() {
    const [showFanfare, setShowFanfare] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowFanfare(true);
        }, 3000); // 3 seconds

        return () => clearTimeout(timer); // Cleanup timer on unmount
    }, []);

    return (
        <div>
            <h1>Testing Fanfare</h1>
            {showFanfare && <Fanfare />}
        </div>
    );
}

export default TestFanfare;
