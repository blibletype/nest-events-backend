interface IEventDto {
  name: string;
  description: string;
  when: string;
  address: string;
}

export interface ICreateEventDto extends IEventDto {}
export interface IUpdateEventDto extends Partial<IEventDto> {}
