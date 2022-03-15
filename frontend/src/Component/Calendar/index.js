import {useState} from 'react'
import {Container, HeadLine, Prev, Month, Next, DateList, 
    Day, DaySquare, Dates, VirtualSquare, Square} from './StyledComponent'

const weekDayNames = ["Su", "M", "Tu", "W", "Th", "F", "Sa"]
const monthNames = [
        "January", "February", "March", "April", 
        "May", "June", "July", "August", "September", 
        "October", "November", "December"
    ]
var today = new Date()

function pushDateList(dateList, firstDate, lastDate) {
    dateList = []
    // Các phần tử trước phần tử first date
    if (firstDate.getDay() > 0)
        for (let i = 0; i < firstDate.getDay(); i++) 
            dateList.push('x')
    
    // Phần tử first date
    dateList.push(firstDate.getDate())

    // Các phần tử sau phần tử first date
    for (let i = firstDate.getDate() + 1; 
            i <= lastDate.getDate(); i++) 
        dateList.push(i)

    return dateList
}

function Calendar() {
    const [month, setMonth] = useState(today.getMonth())
    const [year, setYear] = useState(today.getFullYear())
    const [monthName, setMonthName] = useState(
        monthNames[month] + ' ' + year)
    const [firstDate, setFirstDate] = useState(new Date(year, month, 1))
    const [lastDate, setLastDate] = useState(new Date(year, month + 1, 0))
    const [dateList, setDateList] = useState(() => 
        pushDateList([], firstDate, lastDate))

    function prevMonth() {
        let m
        let y
        if (month === 0){
            m = 11
            y = year - 1
        } 
        else {
            m = month - 1
            y = year
        }
        setMonth(m)
        setYear(y)
        setMonthName(monthNames[m] + ' ' + y)
        setFirstDate(new Date(y, m, 1))
        setLastDate(new Date(y, m + 1, 0))
        setDateList(prevState => pushDateList(prevState, 
            new Date(y, m, 1), new Date(y, m + 1, 0)))
    }

    function nextMonth() {
        let m
        let y
        if (month === 11){
            m = 0
            y = year + 1
        }
        else {
            m = month + 1
            y = year
        }
        setMonth(m)
        setYear(y)
        setMonthName(monthNames[m] + ' ' + y)
        setFirstDate(new Date(y, m, 1))
        setLastDate(new Date(y, m + 1, 0))
        setDateList(prevState => pushDateList(prevState, 
            new Date(y, m, 1), new Date(y, m + 1, 0)))
    }

    return (
        <Container>
            <HeadLine>
                <Prev onClick={prevMonth}>{'<Prev'}</Prev>
                <Month>{monthName}</Month>
                <Next onClick={nextMonth}>{'Next>'}</Next>
            </HeadLine>
            <DateList>
                <Day>
                    {weekDayNames.map(item => (
                        <DaySquare key={item}>{item}</DaySquare>
                    ))}
                </Day>
                <Dates>
                    {       
                        dateList.map((item, index) => {
                            if (item === 'x') {
                                return <VirtualSquare key={index}/>
                            }
                            if (item === 1) {
                                return <Square 
                                            tabIndex={1}
                                            key={index} 
                                            style={{
                                                order: `${firstDate.getDay()}`
                                            }}
                                        >
                                            {item}
                                        </Square>
                            }
                            return <Square 
                                        tabIndex={1} 
                                        key={index} 
                                        style={{order: '8'}}
                                    >
                                        {item}
                                    </Square>
                        })
                    }
                </Dates>
            </DateList>
        </Container>
    )
}
        
export default Calendar