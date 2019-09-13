import React from 'react';

const Header = (props) => {
  return <h1>{props.name}</h1>;
}

const Part = (props) => {
  return <p>{props.name} {props.exercises}</p>;
}

const Content = (props) => {
  const rows = () => props.parts.map(part =>
    <Part
      key={part.id}
      name={part.name}
      exercises={part.exercises}
    />
  );

  const total = props.parts.reduce((a, b) => a + b.exercises, 0);

  return (
    <div>
      {rows()}
      <p><strong>total of {total} exercises</strong></p>
    </div>
  );
}

const Course = (props) => {
  return (
    <div>
      <Header name={props.course.name} />
      <Content parts={props.course.parts} />
    </div>
  );
}

export default Course;
