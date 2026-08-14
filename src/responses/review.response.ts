export class ReviewResponse {
  static fromReview(review: any) {
    return {
      id: review.id,
      userId: review.userId,
      productId: review.productId,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,

      user: review.user
        ? {
            id: review.user.id,
            name: review.user.name,
          }
        : null,

      product: review.product
        ? {
            id: review.product.id,
            name: review.product.name,
          }
        : null,
    };
  }

  static fromReviews(reviews: any[]) {
    return reviews.map((review) =>
      ReviewResponse.fromReview(review)
    );
  }
}