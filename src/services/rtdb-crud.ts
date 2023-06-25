import {
  type Database,
  ref,
  set,
  get,
  orderByChild,
  equalTo,
  query,
  startAt,
  endAt,
  child,
  update,
  remove,
  onValue,
} from "firebase/database";
import { db } from "./firebase";

type RefObject = {
  id: string;
};

// type WhereChainItem = {
//   field: string;
//   value: string | number | boolean;
// };

class RTDB_CRUD<T> {
  private collection: string;
  constructor(private db: Database, collection: string) {
    this.collection = collection;
  }
  async getAll(): Promise<T[]> {
    const snapshot = await get(this.dbRef);
    const data: T[] = Object.values((snapshot.val() ?? {}) as Object);
    return data;
  }

  async get(id: string): Promise<T | null> {
    const _ref = ref(this.db, `${this.collection}/${id}`);
    const snapshot = await get(_ref);
    if (!snapshot.exists()) {
      console.warn(`Document ${this.collection} ${id} does not exist`);
      return null;
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const _data = snapshot.val() as T;
    return _data;
  }

  async batchGet(ids: string[]) {
    return await Promise.all(ids.map((id) => this.get(id)));
  }

  async getWhereEq(field: string, value: string | number): Promise<T[]> {
    const _query = query(this.dbRef, orderByChild(field), equalTo(value));
    const snapshot = await get(_query);
    const data: T[] = Object.values((snapshot.val() ?? {}) as Object);
    return data;
  }

  // async getWhereEqChain<T>(whereChain: WhereChainItem[]): Promise<T[]> {
  //     let ref : Query = this.db.ref(this.collection);
  //     whereChain.forEach((item) => {
  //         ref = ref.orderByChild(item.field).equalTo(item.value);
  //     });
  //     const snapshot = await ref.once('value');
  //     const data: T[] = Object.values((snapshot.val() ?? {}) as Object);
  //     return data;
  // }

  async getBetween(
    field: string,
    start: string | number,
    end: string | number
  ): Promise<T[]> {
    const _query = query(
      this.dbRef,
      orderByChild(field),
      startAt(start),
      endAt(end)
    );
    const snapshot = await get(_query);
    const data: T[] = Object.values((snapshot.val() ?? {}) as Object);
    return data;
  }

  async count(): Promise<number> {
    const snapshot = await get(this.dbRef);
    return snapshot.size;
  }

  async exists(id: string): Promise<boolean> {
    const _query = query(child(this.dbRef, id));
    const snapshot = await get(_query);
    return snapshot.exists();
  }

  async put(id: string, data: T): Promise<string> {
    const _query = child(this.dbRef, id);
    await set(_query, data);
    return id;
  }

  async create(data: T): Promise<string> {
    // @ts-ignore
    const id = data.id as string;
    const _query = child(this.dbRef, id);
    await set(_query, data);
    return id;
  }

  async batchCreate(data: T[]): Promise<string[]> {
    const refs = data.map((item) => {
      // @ts-ignore
      const _query = child(this.dbRef, item.id as string);
      return _query;
    });
    const promises = refs.map((ref, index) => set(ref, data[index]));
    await Promise.all(promises);
    // @ts-ignore
    return data.map((item) => item.id as string);
  }

  async update(id: string, data: Partial<T>): Promise<string> {
    const _query = child(this.dbRef, id);
    await update(_query, data);
    return id;
  }

  async delete(id: string): Promise<string> {
    const _query = child(this.dbRef, id);
    await remove(_query);
    return id;
  }

  async batchDelete(data: string[]): Promise<string[]> {
    const refs = data.map((item) => {
      // @ts-ignore
      const _query = child(this.dbRef, item.id as string);
      return _query;
    });
    const promises = refs.map((ref) => remove(ref));
    await Promise.all(promises);
    // @ts-ignore
    return data.map((item) => item.id as string);
  }

  async deleteAll(): Promise<void> {
    await remove(this.dbRef);
  }

  async deleteWhereEq(field: string, value: string | number): Promise<void> {
    const _query = query(this.dbRef, orderByChild(field), equalTo(value));
    const snapshot = await get(_query);
    const data: RefObject[] = Object.values((snapshot.val() ?? {}) as Object);
    const ids = data.map((item) => item.id);
    await this.batchDelete(ids);
  }

  get dbRef() {
    return ref(this.db, this.collection);
  }

  async backup() {
    const snapshot = await get(this.dbRef);
    const data = snapshot.val();
    return JSON.stringify(data);
  }

  async restore(data: string) {
    const parsedData = JSON.parse(data);
    await set(this.dbRef, parsedData);
  }

  /** Return unsubscribe data */
  subscribe<T>(callback: (data: T[]) => void): () => void {
    const unsubscribe = onValue(this.dbRef, (snapshot) => {
      const data: T[] = snapshot.val() as T[];
      callback(data);
    });
    return unsubscribe;
  }

  subscribeWhere<T>(
    field: string,
    value: string | number,
    callback: (data: T[]) => void
  ): () => void {
    const _query = query(this.dbRef, orderByChild(field), equalTo(value));

    const unsubscribe = onValue(_query, (snapshot) => {
      const data: T[] = snapshot.val() as T[];
      callback(data);
    });
    return unsubscribe;
  }

  subscribeOne(id: string, callback: (data: T | null) => void): () => void {
    const _query = child(this.dbRef, id);

    const unsubscribe = onValue(_query, (snapshot) => {
      if (!snapshot.exists()) {
        console.warn(`Document ${this.collection} ${id} does not exist`);
        callback(null);
        return;
      }
      const data: T = snapshot.val() as T;
      callback(data);
    });
    return unsubscribe;
  }
}

export default function createRTDB<T>(collection: string) {
  return new RTDB_CRUD<T>(db, collection);
}
