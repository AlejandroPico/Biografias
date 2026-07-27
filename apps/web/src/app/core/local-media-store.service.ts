import { Injectable } from '@angular/core';

const DATABASE_NAME = 'mindsage-local-media';
const DATABASE_VERSION = 1;
const OBJECT_STORE = 'media';

@Injectable({ providedIn: 'root' })
export class LocalMediaStoreService {
  private databasePromise?: Promise<IDBDatabase>;

  async put(id: string, blob: Blob): Promise<void> {
    const database = await this.open();
    await this.transaction(database, 'readwrite', (store) => store.put(blob, id));
  }

  async get(id: string): Promise<Blob | undefined> {
    const database = await this.open();
    return this.transaction<Blob | undefined>(database, 'readonly', (store) => store.get(id));
  }

  async delete(id: string): Promise<void> {
    const database = await this.open();
    await this.transaction(database, 'readwrite', (store) => store.delete(id));
  }

  async clear(): Promise<void> {
    const database = await this.open();
    await this.transaction(database, 'readwrite', (store) => store.clear());
  }

  private open(): Promise<IDBDatabase> {
    if (!this.databasePromise) {
      this.databasePromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

        request.onupgradeneeded = () => {
          const database = request.result;
          if (!database.objectStoreNames.contains(OBJECT_STORE)) {
            database.createObjectStore(OBJECT_STORE);
          }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error ?? new Error('No se pudo abrir IndexedDB.'));
      });
    }
    return this.databasePromise;
  }

  private transaction<T = void>(
    database: IDBDatabase,
    mode: IDBTransactionMode,
    operation: (store: IDBObjectStore) => IDBRequest,
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(OBJECT_STORE, mode);
      const request = operation(transaction.objectStore(OBJECT_STORE));
      let result: T;

      request.onsuccess = () => {
        result = request.result as T;
      };
      request.onerror = () =>
        reject(request.error ?? new Error('No se pudo acceder al archivo local.'));
      transaction.oncomplete = () => resolve(result);
      transaction.onerror = () =>
        reject(transaction.error ?? new Error('La operación local ha fallado.'));
      transaction.onabort = () =>
        reject(transaction.error ?? new Error('La operación local se ha cancelado.'));
    });
  }
}
