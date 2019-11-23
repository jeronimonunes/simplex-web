import { MatricialForm } from './matricial-form';

interface Annotation {
    row: number;
    column: number;
    text: string;
    type: string;
}

export interface ParserOutput extends MatricialForm {
    fpi?: string;
    error?: string;
    annotations?: Annotation[];
}
