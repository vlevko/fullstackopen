import React, { useState, useEffect } from 'react';
import personService from './services/persons';

const Notification = ({ message, className }) => {
  if (message === null || className === null) {
    return null;
  }

  return (
    <div className={className}>
      {message}
    </div>
  );
}

const Filter = (props) => {
  return (
    <div>
      filter shown with <input
        value={props.value}
        onChange={props.handler}
      />
   </div>
  );
}

const PersonForm = (props) => {
  return (
    <form onSubmit={props.formHandler}>
      <div>
        name: <input
          value={props.nameValue}
          onChange={props.nameHandler}
        />
      </div>
      <div>
        number: <input
          value={props.numberValue}
          onChange={props.numberHandler}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
}

const Person = (props) => {
  return (
    <div>
      {props.name} {props.number} <button onClick={props.deleteHandler}>delete</button>
    </div>
  );
}

const Persons = (props) => {
  return (props.persons.map(person =>
    <Person
      key={person.id}
      name={person.name}
      number={person.number}
      deleteHandler={() => props.deleteHandler(person.id)}
    />
  ));
}

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [newFilter, setNewFilter] = useState('');
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [notificationClass, setNotificationClass] = useState(null);

  const personsToShow = !newFilter
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()));

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value);
  }

  const addPerson = (event) => {
    event.preventDefault();
    if (!newName) {
      return;
    }

    if (persons.some(person => person.name.toLowerCase() === newName.toLowerCase())) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const person = persons.find(person => person.name.toLowerCase() === newName.toLowerCase());
        const changedPerson = { ...person, number: newNumber };

        personService
          .update(person.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== person.id ? p : returnedPerson));
            setNewName('');
            setNewNumber('');
            setNotificationMessage(`Updated ${returnedPerson.name}`);
            setNotificationClass('success');
            setTimeout(() => {
              setNotificationMessage(null);
              setNotificationClass(null);
            }, 5000);
          })
          .catch(error => {
            setNewName('');
            setNewNumber('');
            setNotificationMessage(
              `Information of ${person.name} has already been removed from server`
            );
            setNotificationClass('error');
            setTimeout(() => {
              setNotificationMessage(null);
              setNotificationClass(null);
            }, 5000);
            setPersons(persons.filter(p => p.id !== person.id));
          });
      }
    } else {
      const personObject = {
        name: newName,
        number: newNumber
      }

      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson));
          setNewName('');
          setNewNumber('');
          setNewFilter('');
          setNotificationMessage(`Added ${returnedPerson.name}`);
          setNotificationClass('success');
          setTimeout(() => {
            setNotificationMessage(null);
            setNotificationClass(null);
          }, 5000);
        });
    }
  }

  const deleteRecord = (id) => {
    const person = persons.find(person => person.id === id);

    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id));
        })
        .catch(error => {
          setNotificationMessage(
            `Information of ${person.name} has already been removed from server`
          );
          setNotificationClass('error');
          setTimeout(() => {
            setNotificationMessage(null);
            setNotificationClass(null);
          }, 5000);
          setPersons(persons.filter(p => p.id !== person.id));
        });
    }
  }

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons);
      });
  }, []);

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification
        message={notificationMessage}
        className={notificationClass}
      />
      <Filter
        value={newFilter}
        handler={handleFilterChange}
      />
      <h3>Add a new</h3>
      <PersonForm
        formHandler={addPerson}
        nameValue={newName}
        nameHandler={handleNameChange}
        numberValue={newNumber}
        numberHandler={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons
        persons={personsToShow}
        deleteHandler={deleteRecord}
      />
    </div>
  );
}

export default App;
