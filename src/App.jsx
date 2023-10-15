import './App.css';
import { useEffect, useRef, useState } from 'react';

// type Sexe = 'MEN' | 'WOMEN';
function App() {
  const [birthday, setBirthday] = useState(new Date('2023-10-14'));
  // const [birthday, setBirthday] = useState(new Date('2003-06-04'));
  const [sexe, setSexe] = useState('MEN');
  const [age, setAge] = useState(0);

  const [maxAge, setMaxAge] = useState(79.3);
  const [maxDate, setMaxDate] = useState(new Date());

  const [percentOfCurrentYear, setPercentOfCurrentYear] = useState(0);

  const intervalRef = useRef(0);

  useEffect(() => {
    setAge(new Date(new Date() - birthday).getFullYear() - 1970);
    if (sexe === 'MEN') setMaxAge(79.3);
    else setMaxAge(89.5);

    calculCurrentDay();
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      calculCurrentDay();

      calculPercentOfCurrentDay();
    }, 1000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [birthday, sexe]);

  useEffect(() => {
    setMaxDate(new Date(Math.round(birthday.getTime() + (maxAge * (1000 * 60 * 60 * 24 * 365.25)))));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxAge])

  function calculCurrentDay() {
    let today = new Date();
    let year = today.getFullYear();
    if (new Date().getTime() < new Date(year, birthday.getMonth(), birthday.getDate()).getTime()) year--;
    let lastDayOfYear = new Date(year + 1, birthday.getMonth(), birthday.getDate()).getTime();
    let firstDayOfYear = new Date(year, birthday.getMonth(), birthday.getDate()).getTime();
    setPercentOfCurrentYear(((today.getTime() - firstDayOfYear) * 100) / (lastDayOfYear - firstDayOfYear));
  }

  function lifeUsed() {
    let today = (new Date()).getTime() - birthday.getTime();
    let max = maxDate.getTime() - birthday.getTime();
    return ((today * 100) / max).toFixed(2)
  }

  function getYearCaseStyle(year, current, past, future) {
    if (age - (year) === 0) {
      return current;
    } else if (age - (year) > 0) {
      return past;
    } else {
      return future;
    }
  }

  function calculPercentOfCurrentDay() {
    let today = new Date();
    let seconds = today.getSeconds() + (60 * (today.getMinutes() + (60 * today.getHours())));
    return seconds / (60 * 60 * 24);
  }

  return (
    <div className='App'>
      <header>
        <img src="./logo.svg" alt="logo" />
        <h1>LIFE SPEND</h1>
      </header>
      <main>
        <div className="inputs">
          <div>
            <label htmlFor='birthday'>Set your birthday </label>
            <input id='birthday' type="date" onChange={(e) => setBirthday(new Date(e.target.value))} />
          </div>
          <div className='sexes'>
            <label htmlFor="sexe">
              Sexe
              <div className='switch-sexe'>
                <div className='sexe men'>♂</div>
                <div className='sexe women'>♀</div>
              </div>
            </label>
            <input id='sexe' type="checkbox" onChange={(e) => setSexe(e.target.checked ? 'MEN' : 'WOMEN')} checked={sexe === 'MEN'} />
          </div>
        </div>
        <div className='years'>
          {
            new Array(Math.ceil(maxAge > age ? maxAge : age)).fill(0).map((_, i) => (
              <div key={i + 1} className='year' style={{
                '--gone': getYearCaseStyle(i, `${percentOfCurrentYear}%`, `100%`, `0%`),
                '--color': (maxAge > i ? 'aquamarine' : 'gold'),
                boxShadow: getYearCaseStyle(i, `0 0 0 1px white`, ``, ``)
              }}></div>
            ))
          }
        </div>
        <p>You have used up <span className='percent-life'>{lifeUsed()}%</span> of your lifetime</p>
      </main>
      <footer>
        <p className='data'>Calculations based on the average life expectancy of a person in France. <span>79.3 years</span> for a man and <span>89.5 years</span> for a woman.</p>
        <p className='warning'>These estimates are based on <strong>averages</strong> and are therefore not exact.</p>
      </footer>
    </div>
  );
}

export default App;
