export const CATEGORIES = [
  'Novel & Comic',
  'Mathematics & Science',
  'History & Culture',
  'Poltics and Government',
  'Engineering',
  'Psychology & Self Development',
];

export const CATEGORIES_DROPDOWN = CATEGORIES.map((c) => ({
  value: c,
  label: c,
}));

export const toasterProps = {
  setBookDone: {
    resolve: () => ({
      title: 'Success',
      description: 'Book marked as done',
    }),
    reject: (msg: string) => ({
      title: 'Failed change book to done',
      description: msg,
    }),
  },
  markFavourite: {
    resolve: () => ({
      title: 'Success',
      description: 'Book marked as favourite',
    }),
    reject: (msg: string) => ({
      title: 'Failed mark book as favourite',
      description: msg,
    }),
  },
  removeFavourite: {
    resolve: () => ({
      title: 'Success',
      description: 'Book removed from favourite',
    }),
    reject: (msg: string) => ({
      title: 'Failed removing book from favourite',
      description: msg,
    }),
  },
  deleteBook: {
    resolve: () => ({
      title: 'Success',
      description: 'Book deleted',
    }),
    reject: (msg: string) => ({
      title: 'Failed delete book data',
      description: msg,
    }),
  },
  updatePinnedBooks: {
    resolve: () => ({
      title: 'Success',
      description: 'Pinned books updated',
    }),
    reject: (msg: string) => ({
      title: 'Failed update pins',
      description: msg,
    }),
  },
  logout: {
    resolve: () => ({
      title: 'Success',
      description: 'Logged out',
    }),
    reject: (msg: string) => ({
      title: 'Logout failed',
      description: msg,
    }),
  },
  register: {
    resolve: () => ({
      title: 'Success',
      description: 'Registered successfully',
    }),
    reject: (msg: string) => ({
      title: 'Failed registering new user',
      description: msg,
    }),
  },
  login: {
    resolve: () => ({
      title: 'Success',
      description: 'Logged in successfully',
    }),
    reject: (msg: string) => ({
      title: 'Login failed',
      description: msg,
    }),
  },
  editProfile: {
    resolve: () => ({
      title: 'Success',
      description: 'Updating profile successfully',
    }),
    reject: (msg: string) => ({
      title: 'Update failed',
      description: msg,
    }),
  },
  addNewBook: {
    resolve: () => ({
      title: 'Success',
      description: 'New book is added',
    }),
    reject: (msg: string) => ({
      title: 'Failed adding new book',
      description: msg,
    }),
  },
  editBook: {
    resolve: () => ({
      title: 'Success',
      description: 'Book is updated',
    }),
    reject: (msg: string) => ({
      title: 'Failed updating book',
      description: msg,
    }),
  },
  uploadPhoto: {
    resolve: () => ({
      title: 'Success',
      description: 'Profile photo updated',
    }),
    reject: (msg: string) => ({
      title: 'Failed updating photo',
      description: msg,
    }),
  },
  emailReset: {
    resolve: () => ({
      title: 'Success',
      description: 'Email has sent',
    }),
    reject: (msg: string) => ({
      title: 'Failed send email',
      description: msg,
    }),
  },
  resetPassword: {
    resolve: () => ({
      title: 'Success',
      description: 'Password is updated',
    }),
    reject: (msg: string) => ({
      title: 'Failed',
      description: msg,
    }),
  },
};
