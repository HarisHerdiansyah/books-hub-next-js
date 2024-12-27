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
    resolve: {
      title: 'Success',
      description: 'Book marked as done',
    },
    reject: {
      title: 'Error',
      description: 'Failed to mark book as done',
    },
  },
  toggleFavourite: {
    resolve: {
      title: 'Success',
      description: 'Book marked as favourite',
    },
    reject: {
      title: 'Error',
      description: 'Failed to mark book as favourite',
    },
  },
  deleteBook: {
    resolve: {
      title: 'Success',
      description: 'Book deleted',
    },
    reject: {
      title: 'Error',
      description: 'Failed to delete book',
    },
  },
  updatePinnedBooks: {
    resolve: {
      title: 'Success',
      description: 'Pinned books updated',
    },
    reject: {
      title: 'Error',
      description: 'Failed to update pinned books',
    },
  },
  logout: {
    resolve: {
      title: 'Success',
      description: 'Logged out',
    },
    reject: {
      title: 'Error',
      description: 'Failed to logout',
    },
  },
  register: {
    resolve: {
      title: 'Success',
      description: 'Registered successfully',
    },
    reject: {
      title: 'Error',
      description: 'Failed to register',
    },
  },
  login: {
    resolve: {
      title: 'Success',
      description: 'Logged in successfully',
    },
    reject: {
      title: 'Error',
      description: 'Failed to login',
    },
  }
}