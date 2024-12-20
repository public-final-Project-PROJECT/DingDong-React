import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' 
import { useState } from 'react';
import { fetchFromAPI } from '../utils/api';

const Calendar = () => {

      const [test, setTest] = useState(0);
      const [responseData, setResponseData] = useState(null);
      const [error, setError] = useState(null);


      const handleSubmit = async (e) => 
          {
              e.preventDefault();
      
              try {
                  const response = await fetch("http://localhost:3013/calendar/list", 
                  {
                      method: "POST",
                      headers: { "Content-Type": "application/json", },
                      body: JSON.stringify({ input: test }), 
                  });
                  setResponseData(response); 
                  console.log("Response:", response);
                  setError(null); 
              } catch (err) {
                  setError(err.message); 
                  console.error("Error fetching data:", err);
              }
          };

    return (
<>
<div className='inner'>
              <form onSubmit={handleSubmit}>
                <label htmlFor="testInput">Test Input: </label>
                <input
                    id="testInput"
                    type="text"
                    value={test}
                    onChange={(e) => setTest(e.target.value)}
                />
                <button type="submit">Submit</button>
            </form>

            {error && (
                <div style={{ color: "red" }}>
                    <h2>Error:</h2>
                    <p>{error}</p>
                </div>
            )}
             {responseData && (
                <div>
                    <h2>Response Data:</h2>
                    <pre>{JSON.stringify(responseData, null, 2)}</pre>
                </div>
            )}
 <div className="full-calendar-container">
        <FullCalendar 
          plugins={[ dayGridPlugin ]}
          initialView="dayGridMonth"
        />
</div>
</div>
        </>
      )

}
export default Calendar;


