export class CreateInpatientDto {
  roomTypeId: number;
  startDate: string;
}

export class AssignRoomDto {
  roomId: number;
  depositAmount: number;
}
