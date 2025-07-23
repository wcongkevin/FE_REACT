export class FileUpload {
  public name: string;
  public size: string;
  public lastModifiedDate: Date;
  constructor(name: string, size: string, lastModifiedDate: Date) {
    this.name = name;
    this.size = size;
    this.lastModifiedDate = lastModifiedDate;
  }
}
