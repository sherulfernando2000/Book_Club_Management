import type { Book } from "./Book";
import type { Reader } from "./Reader";

export type Lending = {
  _id: string;
  book: Book | string;
  reader: Reader | string;
  lentDate: string;
  dueDate: string;
  returned: boolean;
}
