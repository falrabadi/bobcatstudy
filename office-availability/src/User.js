/**
 * @class User
 * @abstract contains user's information
 */

class User {
  constructor(
    username,
    email,
    favoriteRooms,
    favoriteBuildings,
    admin,
    darkmode,
    loaded,
    signedInWithEmailLink,
    provider
  ) {
    this.username = username;
    this.email = email;
    this.favoriteRooms = favoriteRooms;
    this.favoriteBuildings = favoriteBuildings;
    this.admin = admin;
    this.darkmode = darkmode;
    this.loaded = loaded;
    this.signedInWithEmailLink = signedInWithEmailLink;
    this.provider = provider;
  }
}

export default User;
