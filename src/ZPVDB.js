import Dexie from "dexie";

var db = new Dexie("ZPVDB");
db.version(1).stores({
  untersuchungen: "&id,firstname,lastname,date,description"
});

export default db;
