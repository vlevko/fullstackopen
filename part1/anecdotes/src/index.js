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

const Display = (props) => {
  return (
    <div>
      <div>{props.anecdotes[props.selected]}</div>
      <div>has {props.votes} votes</div>
    </div>
  );
}

const App = (props) => {
  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(Array(props.anecdotes.length).fill(0));
  const [top, setTop] = useState(0);

  const setToSelected = () => {
    let randomIndex = selected;
    do {
      randomIndex = Math.floor(Math.random() * props.anecdotes.length);
    } while (randomIndex === selected)
    return setSelected(randomIndex);
  }

  const setToVotes = (selected) => () => {
    const copy = [...votes];
    copy[selected]++;
    if (copy[selected] > top) {
      setTop(copy[selected])
    }
    return setVotes(copy);
  }

  return (
    <div>
      <Title text='Anecdote of the day' />
      <Display
        anecdotes={props.anecdotes}
        selected={selected}
        votes={votes[selected]}
      />
      <Button handleClick={setToVotes(selected)} text='vote' />
      <Button handleClick={setToSelected} text='next anecdote' />
      <Title text='Anecdote with most votes' />
      <Display
        anecdotes={props.anecdotes}
        selected={votes.indexOf(top)}
        votes={top}
      />
    </div>
  );
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(<App anecdotes={anecdotes} />, document.getElementById('root'));
