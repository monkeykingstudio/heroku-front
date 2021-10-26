import {DateTime} from 'luxon';

export class Diapause {
  period: {
    startDiapause: DateTime;
    endDiapause: DateTime;
  };
  species: string;
  colonyId: string;
  status?: string;
  id?: string;
}
