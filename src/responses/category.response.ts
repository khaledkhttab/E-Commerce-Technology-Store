export class CategoryResponse {
  static from(category: any) {
    return {
      id: category.id,
      name: category.name,
      type: category.type,
    };
  }

  static fromMany(categories: any[]) {
    return categories.map((category) =>
      CategoryResponse.from(category)
    );
  }
}