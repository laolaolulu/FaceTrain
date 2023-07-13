import Dexie, { Table } from 'dexie';

//
// Declare Database
//
class Database extends Dexie {
  public faceInfos!: Table<FaceInfo, number>; // id is number in this case

  public constructor() {
    super('Database');
    this.version(1).stores({
      faceInfos: '++id,name,phone,*faces',
    });
    //  this.faceInfos = this.table('faceInfos');
  }
}

export const db = new Database();
