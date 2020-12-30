// Key Storage with Web Cryptography API
//
// Copyright 2014 Info Tech, Inc.
// Provided under the MIT license.
// See LICENSE file for details.

// Saves cryptographic key pairs in IndexedDB.

// The only global name in this library is openKeyStore.
// openKeyStore takes no parameters, and returns a Promise.
// If the key storage database can be opened, the promise
// is fulfilled with the value of a key store object. If
// it cannot be opened, it is rejected with an Error.
//
// The key store object has methods getKey, saveKey, listKeys
// to manage stored keys, and close, to close the key storage
// database, freeing it for other code to use.
//
// The key storage database name is hard coded as KeyStore. It
// uses one object store, called keys.
//

export interface IStoredKey {
  publicKey: CryptoKey,
  privateKey: CryptoKey,
  name: string,
  spki: ArrayBuffer
}

class KeyStore {
  private db: IDBDatabase | null = null;
  private readonly dbName = "KeyStore";
  private readonly objectStoreName = "keys";

  open = (): Promise<void> => {
    if (this.db != null)
      return Promise.resolve();

    return new Promise((fulfill, reject) => {
      if (!window.indexedDB) {
        reject(new Error("IndexedDB is not supported by this browser."));
      }

      const req = indexedDB.open(this.dbName, 1);
      const self = this; // eslint-disable-line @typescript-eslint/no-this-alias
      req.onsuccess = function () {
        self.db = this.result;
        fulfill();
      };
      req.onerror = function () {
        reject(this.error);
      };
      req.onblocked = function () {
        reject(new Error("Database already open"));
      };

      // If the database is being created or upgraded to a new version,
      // see if the object store and its indexes need to be created.
      req.onupgradeneeded = function () {
        self.db = this.result;
        if (!self.db.objectStoreNames.contains(self.objectStoreName)) {
          const objStore = self.db.createObjectStore(self.objectStoreName, { autoIncrement: true });
          objStore.createIndex("name", "name", { unique: false });
          objStore.createIndex("spki", "spki", { unique: false });
        }
      };
    });
  };

  // saveKey method
  //
  // Takes the public and private keys, and an arbitrary name
  // for the saved key. The private key can be passed as null if unavailable.
  //
  // Returns a Promise. If a key can be saved, the
  // Promise is fulfilled with a copy of the object
  // that was saved. Otherwise, it is rejected with an Error.
  //
  saveKey = async (publicKey: CryptoKey, privateKey: CryptoKey, name: string): Promise<IStoredKey> => {
    if (!this.db)
      throw new Error("KeyStore is not open.");

    const spki = await window.crypto.subtle.exportKey("spki", publicKey);
    const savedObject = {
      publicKey: publicKey,
      privateKey: privateKey,
      name: name,
      spki: spki
    };

    await new Promise((fulfill, reject) => {
      if (!this.db)
        throw new Error("KeyStore is not open.");
      const transaction = this.db.transaction([this.objectStoreName], "readwrite");
      transaction.onerror = function () { reject(this.error) };
      transaction.onabort = function () { reject(this.error) };
      transaction.oncomplete = () => fulfill(savedObject);

      const objectStore = transaction.objectStore(this.objectStoreName);
      objectStore.add(savedObject);
    });

    return savedObject;
  };


  // getKey method
  //
  // Takes the name of a property (one of id, name, or spki), and
  // the value of that property to search for.
  //
  // Returns a Promise. If a key with the given propertyValue of
  // the specified propertyName exists in the database, the Promise
  // is fulfilled with the saved object, otherwise it is rejected
  // with an Error.
  //
  // If there are multiple objects with the requested propertyValue,
  // only one of them is passed to the fulfill function.
  //
  getKey = (propertyName: "id" | "name" | "spki", propertyValue: string) => {
    return new Promise((fulfill, reject) => {
      if (!this.db) {
        throw new Error("KeyStore is not open.");
      }

      const transaction = this.db.transaction([this.objectStoreName], "readonly");
      const objectStore = transaction.objectStore(this.objectStoreName);

      let request: IDBRequest<any>;
      if (propertyName === "id") {
        request = objectStore.get(propertyValue);
      } else if (propertyName === "name") {
        request = objectStore.index("name").get(propertyValue);
      } else if (propertyName === "spki") {
        request = objectStore.index("spki").get(propertyValue);
      } else {
        throw new Error("No such property: " + propertyName);
      }

      request.onsuccess = function (evt) {
        fulfill(this.result);
      };

      request.onerror = function (evt) {
        reject(this.error);
      };
    });
  };


  // listKeys method
  //
  // Takes no parameters.
  //
  // Returns a Promise. Unless there is an error, fulfills the
  // Promise with an array of all objects from the key storage
  // database. Otherwise it rejects it with an Error.
  //
  listKeys = (): Promise<Array<{
    id: IDBValidKey,
    value: IStoredKey
  }>> => {
    return new Promise<Array<{
      id: IDBValidKey,
      value: IStoredKey
    }>>((fulfill, reject) => {
      if (!this.db) {
        throw new Error("KeyStore is not open.");
      }

      const list: Array<{
        id: IDBValidKey,
        value: IStoredKey
      }> = [];

      const transaction = this.db.transaction([this.objectStoreName], "readonly");
      transaction.onerror = function () { reject(this.error) };
      transaction.onabort = function () { reject(this.error) };

      const objectStore = transaction.objectStore(this.objectStoreName);
      const cursor = objectStore.openCursor();

      cursor.onsuccess = function () {
        if (this.result) {
          list.push({ id: this.result.key, value: this.result.value as IStoredKey });
          this.result.continue();
        } else {
          fulfill(list);
        }
      }
    });
  };


  // close method
  //
  // Takes no parameters.
  //
  // Simply closes the database and returns immediately. Note that
  // the IndexedDB system actually closes the database in a separate
  // thread, and there is no way to know when that process is complete.
  //
  close = (): void => {
    if (!this.db) {
      throw new Error("KeyStore is not open.");
    }

    this.db.close();
    this.db = null;
  };

  getOrCreateKey = async (id: string): Promise<IStoredKey> => {
    console.log("Opening keystore");
    await this.open();

    const keyList = await this.listKeys();
    const match = keyList.find(k => k.id == id);
    if (match) {
      return match.value;
    } else {
      // make a new key
      const privateKey = await window.crypto.subtle.generateKey(
        {
          name: "AES-GCM",
          hash: "SHA-512",
          length: 256,
        },
        true,
        ["encrypt", "decrypt", "wrapKey", "unwrapKey"]
      );
      const publicKeyJwk = await crypto.subtle.exportKey("jwk", privateKey);
      delete publicKeyJwk.d;
      delete publicKeyJwk.dp;
      delete publicKeyJwk.dq;
      delete publicKeyJwk.q;
      delete publicKeyJwk.qi;
      publicKeyJwk.key_ops = ["encrypt", "wrapKey"];
      const publicKey = await crypto.subtle.importKey("jwk", publicKeyJwk, {
        name: "AES-GCM",
        hash: "SHA-512"
      }, true, ["encrypt", "wrapKey"]);
      return await this.saveKey(publicKey, privateKey, id);
    }
  }
}

export default new KeyStore();
