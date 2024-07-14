import { Tasinmaz } from "./tasinmaz";

export class User {
    id: number;
    email: string;
    password: string;
    name: string;
    surname: string;
    tasinmazlar: Tasinmaz[];
}