import Dexie from "dexie";
import uuid from "uuid";

const remotePretender = {
  isOnline: true,
  remoteChanges: [],
  addRemoteChange: (firstname, lastname, description) => {
    const remoteObject = {
      id: uuid(),
      firstname,
      lastname,
      date: new Date(),
      description
    };
    const databaseChange = {
      type: 1,
      table: "untersuchungen",
      key: remoteObject.id,
      obj: remoteObject
    };
    remotePretender.remoteChanges.push(databaseChange);
  },
  pop: () => {
    const p = remotePretender.remoteChanges;
    remotePretender.remoteChanges = [];
    return p;
  }
};

const zpvSync = {
  sync: function(
    context,
    url,
    options,
    baseRevision,
    syncedRevision,
    changes,
    partial,
    applyRemoteChanges,
    onChangesAccepted,
    onSuccess,
    onError
  ) {
    console.log("sync was called");

    if (remotePretender.isOnline) {
      console.log("We pretend to be online");
      console.log("send changes to server", changes);
      console.log("pretend server has accepted changes");
      onChangesAccepted();

      const remoteChanges = remotePretender.pop();
      console.log(
        "Now we have remote changes",
        remoteChanges,
        "from server and call the server with them..."
      );
      applyRemoteChanges(remoteChanges, new Date(), false);
      console.log(
        "Confirm that all changes from remote have been sent to applyRemoteChanges"
      );
      onSuccess({ again: 10000 });
    } else {
      console.log("We pretend to be offline");
      onError("Disconnected from server", 5000);
    }
  }
};

Dexie.Syncable.registerSyncProtocol("zpvSync", zpvSync);

export default remotePretender;
