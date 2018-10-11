import React, { Component } from "react";
import "./App.css";
import db from "./ZPVDB";
import uuid from "uuid";

const firstnames = ["Reinhold", "Gandalf", "Elon", "Grischa", "Roman"];
const lastnames = ["Erler", "Muñoz", "Schaller", "Musk", "Dawkins"];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      untersuchungen: []
    };
  }

  addRecords = async () => {
    console.log("Add some records...");
    const record = await db.untersuchungen.put({
      id: uuid(),
      firstname: firstnames[Math.floor(Math.random() * firstnames.length)],
      lastname: lastnames[Math.floor(Math.random() * lastnames.length)],
      date: new Date(),
      description: "Alles in Ordnung."
    });
    console.log(record);
  };

  changeRecord = async () => {
    const record = await db.untersuchungen.orderBy("date").first();
    console.log("Changeing ", record);
    record.date = new Date();
    record.firstname =
      firstnames[Math.floor(Math.random() * firstnames.length)];
    console.log("to ", record);
    db.untersuchungen.put(record);
  };

  searchRecords = event => {
    db.untersuchungen
      .where("firstname")
      .startsWithIgnoreCase(event.target.value)
      .toArray(untersuchungen => {
        this.setState({ untersuchungen });
      });
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>Dexie Example App</p>
        </header>
        <div className="Dexie">
          <button onClick={this.addRecords}>Daten generieren</button>
          <button onClick={this.changeRecord}>Daten ändern</button>
          <h1>
            Untersuchungen suchen <input onChange={this.searchRecords} />
          </h1>
          {this.state.untersuchungen.map(untersuchung => {
            return (
              <div key={untersuchung.id}>
                {untersuchung.date.toString()}: {untersuchung.firstname},{" "}
                {untersuchung.lastname}, {untersuchung.description}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default App;
