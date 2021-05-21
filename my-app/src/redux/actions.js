export const SET_USER = 'SET_USER';
export const SET_PUBLICATIONS = 'SET_PUBLICATIONS';

export function setUser(user) {
  return { type: SET_USER, user };
}

export function setPublications(publications) {
  return { type: SET_PUBLICATIONS, publications };
}
