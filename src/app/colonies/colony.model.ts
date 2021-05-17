export class Colony {
  id: string;
  creator: string;
  species: string;
  creationDate: string;
  name: string;
  polyGyne: boolean;
  polyGyneCount: number;
  gyneName: string;
  counter: {
    id: string;
    name: string;
    minorCount: number;
    mediumCount: number;
    majorCount: number;
    polymorph: boolean;
    polyCount?: number;
    breed?: boolean;
    breedCount?: number;
  };
}
