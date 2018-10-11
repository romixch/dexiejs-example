import Dexie from "dexie";
import "dexie-observable";
import "dexie-syncable";
import "./ZPVSyncProtocol";

var db = new Dexie("ZPVDB");
db.version(1).stores({
  untersuchungen: "$$id,firstname,lastname,date,description"
});
db.syncable.connect(
  "zpvSync",
  "https://myurl.com/"
);

var nonSyncDb = new Dexie("ZPV_Dexie_NonSync");
nonSyncDb.version(1).stores({
  zip: "zip,city"
});
nonSyncDb.zip.clear();
nonSyncDb.zip.put({ zip: 6130, city: "willisau" });
nonSyncDb.zip.put({ zip: 6203, city: "Sempach Station" });

export default db;
