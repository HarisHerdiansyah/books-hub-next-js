export type Book = {
  userId: string;
  bookId: string;
  title: string;
  writers: string[];
  year: number;
  isDone: boolean;
  isFav: boolean;
  isPin: boolean;
  views: number;
  categories: string[];
  visibility: boolean;
  username: string;
  userImageUrl: string;
};

export type BookDetail = Book & {
  bookDetail: {
    bookId: string;
    rating: number;
    description: string;
  };
};
