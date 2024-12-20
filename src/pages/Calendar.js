import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!

const Calendar = () => {
   

    return (


        <FullCalendar 
          plugins={[ dayGridPlugin ]}
          initialView="dayGridMonth"
        />
      )

}
export default Calendar;


