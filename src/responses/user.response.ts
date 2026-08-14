export class UserResponse {
  static fromUser(user: any) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static fromUsers(users: any[]) {
    return users.map((user: any) =>
      UserResponse.fromUser(user)
    );
  }
}