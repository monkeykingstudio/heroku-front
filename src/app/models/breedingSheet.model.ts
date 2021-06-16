export class BreedingSheet {
  status: string;
  genre: string;
  species: string;
  family: string;
  regions: any[];
  foods: any[];
  polygyne: boolean;
  polymorphism: boolean;
  semiClaustral: boolean;
  needDiapause: boolean;
  gyneSize: number;
  workerSize: number;
  gyneLives: number;
  workerLives: number;
  temperature: any[];
  diapauseTemperature: any[];
  hygrometry: any[];
  maxPopulation: number;
  id?: string;
  difficulty?: number;
  gynePictures?: [];
  pictures?: [];
  tribu?: string;
  nestType?: string;
  trophalaxy?: boolean;
  drinker?: boolean;
  driller?: boolean;
  sources?: [];
  diapausePeriod?: any[];
  swarmingPeriod?: any[];
  maleSize?: string;
  majorSize?: string;
}
