/**
 * @class Room
 * @abstract create the class contains room information.
 */

class Room {
  constructor(building, number, capacity, info, status, favorite, remove, notifications) {
    this.building = building;
    this.number = number;
    this.capacity = capacity;
    this.info = info;
    this.status = status;
    this.favorite = favorite;
    this.remove = remove;
    this.notifications = notifications;
  }
}

export default Room;
