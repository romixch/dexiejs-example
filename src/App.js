import React, { Component } from "react";
import "./App.css";
import db from "./ZPVDB";
import uuid from "uuid";
import remotePretender from "./ZPVSyncProtocol";
import Dexie from "dexie";

const firstnames = ["Reinhold", "Gandalf", "Elon", "Grischa", "Roman"];
const lastnames = ["Erler", "Muñoz", "Schaller", "Musk", "Dawkins"];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOnline: true,
      syncStatus: "",
      untersuchungen: []
    };
  }

  componentDidMount = async () => {
    this.setState({
      isOnline: remotePretender.isOnline,
      untersuchungen: await db.untersuchungen.toArray()
    });
    db.syncable.on(
      "statusChanged",
      function(newStatus, url) {
        this.setState({ syncStatus: Dexie.Syncable.StatusTexts[newStatus] });
      }.bind(this)
    );
  };

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

  addRemoteRecords = async () => {
    remotePretender.addRemoteChange(
      "Remote first",
      "Remote last",
      "Alles kaputt!"
    );
  };

  toggleOnline = () => {
    remotePretender.isOnline = !remotePretender.isOnline;
    this.setState({ isOnline: remotePretender.isOnline });
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
          <button onClick={this.addRecords}>Daten auf Client generieren</button>
          <button onClick={this.changeRecord}>Daten auf Client ändern</button>
          <button onClick={this.addRemoteRecords}>
            Daten auf Server generieren
          </button>
          <button onClick={this.toggleOnline}>toggle Online / Offline</button>
          <div>Sync Status: {this.state.syncStatus}</div>
          <div>Online: {this.state.isOnline ? "yes" : "no"}</div>
          <h1>
            Untersuchungen suchen ({this.state.untersuchungen.length}){" "}
            <input onChange={this.searchRecords} />
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
