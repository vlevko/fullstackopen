import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const Title = (props) => {
  return <h2>{props.text}</h2>;
}

const Button = (props) => {
  return (
    <button onClick={props.handleClick}>
      {props.text}
    </button>
  );
}

const Statistic = (props) => {
  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
  );
}

const Statistics = (props) => {
  if (!props.all) {
    return <div>No feedback given</div>;
  }
  return (
    <table>
      <tbody>
        <Statistic text='good' value={props.good} />
        <Statistic text='neutral' value={props.neutral} />
        <Statistic text='bad' value={props.bad} />
        <Statistic text='all' value= {props.all} />
        <Statistic text='average' value= {props.average} />
        <Statistic text='positive' value= {props.positive + ' %'} />
      </tbody>
    </table>
  );
}

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const all = good + neutral + bad;
  const average = all ? (good - bad) / all : 0;
  const positive = all ? good * 100 / all : 0;

  const setToValue = (handler, value) => handler(value);

  return (
    <div>
      <Title text='give feedback' />
      <Button handleClick={() => setToValue(setGood, good + 1)} text='good' />
      <Button handleClick={() => setToValue(setNeutral, neutral + 1)} text='neutral' />
      <Button handleClick={() => setToValue(setBad, bad + 1)} text='bad' />
      <Title text='statistics' />
      <Statistics
        good={good}
        neutral={neutral}
        bad={bad}
        all={all}
        average={average}
        positive={positive}
      />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
