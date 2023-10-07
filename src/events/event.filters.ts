export class ListEvents {
  when?: WhenEventFilterEnum = WhenEventFilterEnum.All;
  page: number = 1;
}

export enum WhenEventFilterEnum {
  All = 1,
  Today,
  Tommorow,
  ThisWeek,
  NextWeek,
}
