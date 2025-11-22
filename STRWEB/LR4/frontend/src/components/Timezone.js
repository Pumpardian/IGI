import React, { useEffect, useState } from "react";

const Timezone = () => {
    const [local, updateLocal] = useState(new Date());
    const [utc, updateUtc] = useState(new Date().toUTCString());

    useEffect(() => {
        const interval = setInterval(() => {
            updateLocal(new Date());
            updateUtc(new Date().toUTCString());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    return (
        <div className="timezone">
            <p title={utc}>{local.toLocaleString()} : {timezone}</p>
        </div>
    );
}

export default Timezone;